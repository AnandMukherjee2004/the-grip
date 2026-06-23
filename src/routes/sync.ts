import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { decode } from 'next-auth/jwt';
import { db } from '../db/index';
import { connectors, workspaces, orgMembers } from '../db/schema';
import { eq, and, or } from 'drizzle-orm';

const syncRoute = new Hono();

// POST /:connectorId - Trigger manual sync for a connector
syncRoute.post('/:connectorId', async (c) => {
  try {
    const connectorId = c.req.param('connectorId');

    let userId: string;

    const xUserId = c.req.header('x-user-id');
    const xInternalSecret = c.req.header('x-internal-secret');

    if (xUserId && xInternalSecret && xInternalSecret === process.env.INTERNAL_SECRET) {
      userId = xUserId;
    } else {
      // 1. Authenticate user session from request cookies
      const sessionToken = getCookie(c, '__Secure-next-auth.session-token') || getCookie(c, 'next-auth.session-token');
      if (!sessionToken) {
        return c.json({ error: 'unauthorized', message: 'Unauthorized: No active session' }, 401);
      }

      let decoded;
      try {
        decoded = await decode({
          token: sessionToken,
          secret: process.env.AUTH_SECRET!,
          salt: getCookie(c, '__Secure-next-auth.session-token')
            ? '__Secure-next-auth.session-token'
            : 'next-auth.session-token',
        });
      } catch (e) {
        console.error('Failed to decode next-auth session token:', e);
        return c.json({ error: 'unauthorized', message: 'Unauthorized: Invalid session token' }, 401);
      }

      if (!decoded || !(decoded as any).id) {
        return c.json({ error: 'unauthorized', message: 'Unauthorized: User ID not found in session' }, 401);
      }

      userId = (decoded as any).id as string;
    }

    // 2. Query database for the connector
    const [connector] = await db
      .select({
        id: connectors.id,
        workspaceId: connectors.workspaceId,
        toolId: connectors.toolId,
        status: connectors.status,
      })
      .from(connectors)
      .where(eq(connectors.id, connectorId))
      .limit(1);

    if (!connector) {
      return c.json({ error: 'not_found', message: 'Connector not found' }, 404);
    }

    if (connector.status !== 'active') {
      return c.json({ error: 'bad_request', message: 'Connector is not active' }, 400);
    }

    // 3. Verify workspace authorization for the user
    const [authorizedWorkspace] = await db
      .select({
        id: workspaces.id,
      })
      .from(workspaces)
      .innerJoin(orgMembers, eq(orgMembers.orgId, workspaces.orgId))
      .where(
        and(
          eq(workspaces.id, connector.workspaceId),
          or(
            eq(orgMembers.userId, userId),
            eq(orgMembers.clerkUserId, userId)
          )
        )
      )
      .limit(1);

    if (!authorizedWorkspace) {
      return c.json({ error: 'forbidden', message: 'Forbidden: You do not have access to this workspace' }, 403);
    }

    // 4. Invoke the Render Python worker sync API
    const workerUrl = process.env.WORKER_URL ?? 'https://grip-python-worker.onrender.com';
    const workerSecret = process.env.WORKER_SECRET;

    if (!workerSecret) {
      console.error('WORKER_SECRET environment variable is missing');
      return c.json({ error: 'internal_error', message: 'Worker secret is not configured' }, 500);
    }

    let response;
    try {
      response = await fetch(`${workerUrl}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Worker-Secret': workerSecret,
        },
        body: JSON.stringify({
          connector_id: connectorId,
          workspace_id: connector.workspaceId,
          tool_id: connector.toolId,
        }),
        signal: (AbortSignal as any).timeout(10000),
      });
    } catch (fetchError) {
      console.error('Failed calling Python worker due to error or timeout:', fetchError);
      return c.json({ error: 'bad_gateway', message: 'Worker unavailable' }, 502);
    }

    if (!response.ok) {
      console.error(`Python worker returned error status ${response.status}: ${await response.text()}`);
      return c.json({ error: 'bad_gateway', message: 'Worker unavailable' }, 502);
    }

    const workerResult = await response.json();
    return c.json(workerResult, 200);

  } catch (error) {
    console.error('Failed to trigger sync:', error);
    return c.json({ error: 'internal_error', message: 'Failed to trigger sync' }, 500);
  }
});

export default syncRoute;
