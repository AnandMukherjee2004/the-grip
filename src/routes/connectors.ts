import { Hono } from 'hono';
import { db } from '../db/index';
import { connectors } from '../db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { getConnector } from '../lib/connector-registry';
import { encryptCredentials, decryptCredentials } from '../lib/crypto';

const connectorsRouter = new Hono();

// POST / - Create or upsert a connector
connectorsRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { workspaceId, toolId, credentials } = body;

    // Validation
    if (!workspaceId || !toolId || !credentials) {
      return c.json({ error: 'bad_request', message: 'Missing required fields' }, 400);
    }

    const meta = getConnector(toolId);
    if (!meta) {
      return c.json({ error: 'bad_request', message: `Connector registry entry not found for tool: ${toolId}` }, 400);
    }

    const credentialsEncB64 = encryptCredentials(credentials);

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
          authMethod: meta.authMethod,
          status: 'active',
          deletedAt: null, // restore if soft-deleted
          updatedAt: new Date(),
        })
        .where(eq(connectors.id, existing[0].id))
        .returning({
          id: connectors.id,
          workspaceId: connectors.workspaceId,
          toolId: connectors.toolId,
          authMethod: connectors.authMethod,
          status: connectors.status,
          connectorVersion: connectors.connectorVersion,
          capabilities: connectors.capabilities,
          lastSyncedAt: connectors.lastSyncedAt,
          lastAccessedAt: connectors.lastAccessedAt,
          deletedAt: connectors.deletedAt,
          createdAt: connectors.createdAt,
          updatedAt: connectors.updatedAt,
        });
      result = updated;
    } else {
      // Insert new connector
      const [inserted] = await db
        .insert(connectors)
        .values({
          workspaceId,
          toolId,
          authMethod: meta.authMethod,
          credentialsEncB64,
          status: 'active',
        })
        .returning({
          id: connectors.id,
          workspaceId: connectors.workspaceId,
          toolId: connectors.toolId,
          authMethod: connectors.authMethod,
          status: connectors.status,
          connectorVersion: connectors.connectorVersion,
          capabilities: connectors.capabilities,
          lastSyncedAt: connectors.lastSyncedAt,
          lastAccessedAt: connectors.lastAccessedAt,
          deletedAt: connectors.deletedAt,
          createdAt: connectors.createdAt,
          updatedAt: connectors.updatedAt,
        });
      result = inserted;
    }

    return c.json(result, 201);
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

// GET /:id - Get a connector by ID
connectorsRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const [connector] = await db
      .select({
        id: connectors.id,
        workspaceId: connectors.workspaceId,
        toolId: connectors.toolId,
        authMethod: connectors.authMethod,
        status: connectors.status,
        connectorVersion: connectors.connectorVersion,
        capabilities: connectors.capabilities,
        lastSyncedAt: connectors.lastSyncedAt,
        lastAccessedAt: connectors.lastAccessedAt,
        createdAt: connectors.createdAt,
        updatedAt: connectors.updatedAt,
      })
      .from(connectors)
      .where(eq(connectors.id, id))
      .limit(1);

    if (!connector) {
      return c.json({ error: 'not_found', message: 'Connector not found' }, 404);
    }

    return c.json(connector, 200);
  } catch (error) {
    console.error('Failed to fetch connector:', error);
    return c.json({ error: 'internal_error', message: 'Failed to fetch connector' }, 500);
  }
});

// DELETE / - Soft delete a connector
connectorsRouter.delete('/', async (c) => {
  try {
    const workspaceId = c.req.query('workspaceId');
    const toolId = c.req.query('toolId');
    if (!workspaceId || !toolId) {
      return c.json({ error: 'bad_request', message: 'Missing workspaceId or toolId query parameter' }, 400);
    }

    await db
      .update(connectors)
      .set({
        status: 'disconnected',
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(connectors.workspaceId, workspaceId),
          eq(connectors.toolId, toolId)
        )
      );

    return c.json({ success: true }, 200);
  } catch (error) {
    console.error('Failed to disconnect connector:', error);
    return c.json({ error: 'internal_error', message: 'Failed to disconnect connector' }, 500);
  }
});

// GET /:id/credentials - Internal worker use only
connectorsRouter.get('/:id/credentials', async (c) => {
  try {
    const id = c.req.param('id');
    const internalSecret = c.req.header('x-internal-secret');

    if (!internalSecret || internalSecret !== process.env.INTERNAL_SECRET) {
      return c.json({ error: 'unauthorized', message: 'Unauthorized access' }, 401);
    }

    const [connector] = await db
      .select({
        credentialsEncB64: connectors.credentialsEncB64,
      })
      .from(connectors)
      .where(eq(connectors.id, id))
      .limit(1);

    if (!connector) {
      return c.json({ error: 'not_found', message: 'Connector not found' }, 404);
    }

    if (!connector.credentialsEncB64) {
      return c.json({}, 200);
    }

    const credentials = decryptCredentials(connector.credentialsEncB64);
    return c.json(credentials, 200);
  } catch (error) {
    console.error('Failed to decrypt credentials:', error);
    return c.json({ error: 'internal_error', message: 'Failed to decrypt credentials' }, 500);
  }
});

export default connectorsRouter;
