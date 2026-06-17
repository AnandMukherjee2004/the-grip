import { Hono } from 'hono';
import { db } from '../db/index';
import { connectors } from '../db/schema';
import { eq, and, isNull } from 'drizzle-orm';

const connectorsRouter = new Hono();

// POST / - Create or upsert a connector
connectorsRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { workspaceId, toolId, authMethod, credentials } = body;

    // Validation
    if (!workspaceId || !toolId || !authMethod || !credentials) {
      return c.json({ error: 'bad_request', message: 'Missing required fields' }, 400);
    }

    // Base64 encode the credentials object as requested
    const credentialsStr = JSON.stringify(credentials);
    const credentialsEncB64 = Buffer.from(credentialsStr).toString('base64');

    // Check if connector already exists (soft deletes checked as well)
    const existing = await db
      .select()
      .from(connectors)
      .where(
        and(
          eq(connectors.workspaceId, workspaceId),
          eq(connectors.toolId, toolId)
        )
      )
      .limit(1);

    let result;

    if (existing.length > 0) {
      // Upsert: Update existing connector
      const [updated] = await db
        .update(connectors)
        .set({
          credentialsEncB64,
          authMethod,
          status: 'active',
          deletedAt: null, // restore if soft-deleted
          updatedAt: new Date(),
        })
        .where(eq(connectors.id, existing[0].id))
        .returning({
          id: connectors.id,
          toolId: connectors.toolId,
          status: connectors.status,
        });
      result = updated;
    } else {
      // Insert new connector
      const [inserted] = await db
        .insert(connectors)
        .values({
          workspaceId,
          toolId,
          authMethod,
          credentialsEncB64,
          status: 'active',
        })
        .returning({
          id: connectors.id,
          toolId: connectors.toolId,
          status: connectors.status,
        });
      result = inserted;
    }

    return c.json({
      connectorId: result.id,
      toolId: result.toolId,
      status: result.status,
    }, 201);
  } catch (error) {
    console.error('Failed to save connector:', error);
    return c.json({ error: 'internal_error', message: 'Failed to save connector' }, 500);
  }
});

// GET / - Get all active (non-deleted) connectors for workspace
connectorsRouter.get('/', async (c) => {
  try {
    const workspaceId = c.req.query('workspaceId');
    if (!workspaceId) {
      return c.json({ error: 'bad_request', message: 'Missing workspaceId query parameter' }, 400);
    }

    const results = await db
      .select({
        id: connectors.id,
        workspaceId: connectors.workspaceId,
        toolId: connectors.toolId,
        authMethod: connectors.authMethod,
        status: connectors.status,
        connectorVersion: connectors.connectorVersion,
        capabilities: connectors.capabilities,
        lastSyncedAt: connectors.lastSyncedAt,
        createdAt: connectors.createdAt,
        updatedAt: connectors.updatedAt,
      })
      .from(connectors)
      .where(
        and(
          eq(connectors.workspaceId, workspaceId),
          isNull(connectors.deletedAt)
        )
      );

    return c.json({ connectors: results }, 200);
  } catch (error) {
    console.error('Failed to fetch connectors:', error);
    return c.json({ error: 'internal_error', message: 'Failed to fetch connectors' }, 500);
  }
});

export default connectorsRouter;
