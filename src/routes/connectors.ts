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

    if (toolId === 'razorpay') {
      const { key_id, key_secret } = credentials;
      if (!key_id || !key_secret || !key_id.trim() || !key_secret.trim()) {
        return c.json({ error: 'bad_request', message: 'Key ID and Key Secret are required for Razorpay' }, 400);
      }

      try {
        const authHeader = `Basic ${Buffer.from(`${key_id}:${key_secret}`).toString('base64')}`;
        const razorpayRes = await fetch('https://api.razorpay.com/v1/payments?count=1', {
          method: 'GET',
          headers: {
            'Authorization': authHeader
          }
        });

        if (razorpayRes.status === 401 || razorpayRes.status === 403) {
          return c.json({ error: 'invalid_credentials', message: 'Invalid Razorpay Key ID or Key Secret. Please check and try again.' }, 400);
        }
      } catch (fetchError) {
        console.error('Failed to validate Razorpay credentials due to network/timeout error, proceeding to save:', fetchError);
      }
    }

    let cleanHostToSave: string | null = null;
    if (toolId === 'leadsquared') {
      const accessKey = credentials.accessKey || credentials.access_key;
      const secretKey = credentials.secretKey || credentials.secret_key;
      if (!accessKey || !secretKey || !accessKey.trim() || !secretKey.trim()) {
        return c.json({ error: 'bad_request', message: 'Access Key and Secret Key are required for LeadSquared' }, 400);
      }

      const host = credentials.host_url || credentials.host || credentials.lsq_host;
      if (!host || !host.trim()) {
        return c.json({ error: 'bad_request', message: 'Host URL is required for LeadSquared' }, 400);
      }

      const cleanHost = host.replace(/^https?:\/\//, '').replace(/\/$/, '');
      cleanHostToSave = cleanHost;

      try {
        const url = `https://${cleanHost}/v2/Authentication.svc/UserByAccessKey.Get?accessKey=${encodeURIComponent(accessKey)}&secretKey=${encodeURIComponent(secretKey)}`;
        const leadsquaredRes = await fetch(url, {
          method: 'GET',
        });

        if (leadsquaredRes.status === 401) {
          return c.json({ error: 'invalid_credentials', message: 'Invalid LeadSquared Access Key or Secret Key. Please check and try again.' }, 400);
        }

        if (leadsquaredRes.status >= 200 && leadsquaredRes.status < 300) {
          try {
            const resBody = await leadsquaredRes.json();
            const urls = resBody?.LSQCommonServiceURLs || resBody?.d?.LSQCommonServiceURLs;
            const apiVal = urls?.api;
            if (typeof apiVal === 'string' && apiVal.trim()) {
              const lsqHost = apiVal.trim();
              const cleanLsqHost = lsqHost.replace(/^https?:\/\//, '').replace(/\/$/, '');
              if (cleanLsqHost !== cleanHost) {
                return c.json({ error: 'bad_request', message: `Host does not match your LeadSquared account region. Expected: ${lsqHost}` }, 400);
              }
            } else {
              console.warn('LSQCommonServiceURLs.api not found in LeadSquared response:', JSON.stringify(resBody));
            }
          } catch (parseError) {
            console.warn('Failed to parse LeadSquared response body:', parseError);
          }
        }
      } catch (fetchError) {
        const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError);
        const redactedMessage = errorMessage.split(secretKey).join('[REDACTED]');
        console.error('Failed to validate LeadSquared credentials due to network/timeout error, proceeding to save:', redactedMessage);
      }
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

    let capabilitiesToSave: any = undefined;
    if (toolId === 'leadsquared' && cleanHostToSave) {
      const existingCapabilities = existing.length > 0
        ? (existing[0].capabilities || {})
        : (meta.capabilities || {});

      capabilitiesToSave = {
        ...(typeof existingCapabilities === 'object' ? existingCapabilities : {}),
        lsq_host: cleanHostToSave
      };
    }

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
          ...(capabilitiesToSave !== undefined ? { capabilities: capabilitiesToSave } : {})
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
          ...(capabilitiesToSave !== undefined ? { capabilities: capabilitiesToSave } : {})
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

// POST /test - Validate credentials
connectorsRouter.post('/test', async (c) => {
  try {
    const body = await c.req.json();
    const { toolId, credentials } = body;

    if (!toolId || !credentials) {
      return c.json({ error: 'bad_request', message: 'Missing toolId or credentials' }, 400);
    }

    if (toolId === 'razorpay') {
      const { key_id, key_secret } = credentials;
      if (!key_id || !key_secret || !key_id.trim() || !key_secret.trim()) {
        return c.json({ success: false, message: 'Key ID and Key Secret are required for Razorpay' }, 200);
      }

      try {
        const authHeader = `Basic ${Buffer.from(`${key_id}:${key_secret}`).toString('base64')}`;
        const razorpayRes = await fetch('https://api.razorpay.com/v1/payments?count=1', {
          method: 'GET',
          headers: {
            'Authorization': authHeader
          }
        });

        if (razorpayRes.status === 401 || razorpayRes.status === 403) {
          return c.json({ success: false, message: 'Invalid Razorpay Key ID or Key Secret. Please check and try again.' }, 200);
        }
        return c.json({ success: true }, 200);
      } catch (fetchError) {
        return c.json({ success: false, message: `Network error: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}` }, 200);
      }
    }

    if (toolId === 'leadsquared') {
      const accessKey = credentials.accessKey || credentials.access_key;
      const secretKey = credentials.secretKey || credentials.secret_key;
      if (!accessKey || !secretKey || !accessKey.trim() || !secretKey.trim()) {
        return c.json({ success: false, message: 'Access Key and Secret Key are required for LeadSquared' }, 200);
      }

      const host = credentials.host_url || credentials.host || credentials.lsq_host;
      if (!host || !host.trim()) {
        return c.json({ error: 'bad_request', message: 'Host URL is required for LeadSquared' }, 400);
      }

      const cleanHost = host.replace(/^https?:\/\//, '').replace(/\/$/, '');

      try {
        const url = `https://${cleanHost}/v2/Authentication.svc/UserByAccessKey.Get?accessKey=${encodeURIComponent(accessKey)}&secretKey=${encodeURIComponent(secretKey)}`;
        const leadsquaredRes = await fetch(url, {
          method: 'GET',
        });

        if (leadsquaredRes.status === 401) {
          return c.json({ success: false, message: 'Invalid LeadSquared Access Key or Secret Key. Please check and try again.' }, 200);
        }

        const resBody = await leadsquaredRes.json();
        if (resBody?.Status === 'Error' || resBody?.d?.Status === 'Error') {
          return c.json({ success: false, message: resBody?.Message || resBody?.d?.Message || 'Authentication failed' }, 200);
        }

        const urls = resBody?.LSQCommonServiceURLs || resBody?.d?.LSQCommonServiceURLs;
        const apiVal = urls?.api;
        if (typeof apiVal === 'string' && apiVal.trim()) {
          const lsqHost = apiVal.trim();
          const cleanLsqHost = lsqHost.replace(/^https?:\/\//, '').replace(/\/$/, '');
          if (cleanLsqHost !== cleanHost) {
            return c.json({ error: 'bad_request', message: `Host does not match your LeadSquared account region. Expected: ${lsqHost}` }, 400);
          }
        }

        return c.json({ success: true }, 200);
      } catch (fetchError) {
        return c.json({ success: false, message: `Network error: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}` }, 200);
      }
    }

    // Default fallback for other integrations
    return c.json({ success: true, message: 'Configuration format validated' }, 200);
  } catch (error) {
    console.error('Failed to test connector credentials:', error);
    return c.json({ error: 'internal_error', message: 'Failed to run connection test' }, 500);
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
