import { Hono } from 'hono';
import { db } from '../db/index';
import { pipelineRuns } from '../db/schema';

const pipelineRunsRouter = new Hono();

// POST / - Create a pipeline run
pipelineRunsRouter.post('/', async (c) => {
  try {
    const internalSecret = c.req.header('x-internal-secret');
    if (!internalSecret || internalSecret !== process.env.INTERNAL_SECRET) {
      return c.json({ error: 'unauthorized', message: 'Unauthorized access' }, 401);
    }

    const body = await c.req.json();
    const { connectorId, workspaceId, status, recordsSynced, recordsFailed, errorCode, errorSummary } = body;

    if (!connectorId || !workspaceId || !status) {
      return c.json({ error: 'bad_request', message: 'Missing required fields' }, 400);
    }

    const [inserted] = await db
      .insert(pipelineRuns)
      .values({
        connectorId,
        workspaceId,
        status,
        recordsSynced: recordsSynced ?? 0,
        recordsFailed: recordsFailed ?? 0,
        errorCode,
        errorSummary,
        finishedAt: status === 'success' || status === 'failed' ? new Date() : null,
      })
      .returning();

    return c.json(inserted, 201);
  } catch (error) {
    console.error('Failed to create pipeline run:', error);
    return c.json({ error: 'internal_error', message: 'Failed to create pipeline run' }, 500);
  }
});

export default pipelineRunsRouter;
