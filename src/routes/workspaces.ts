import { Hono } from 'hono';
import { db } from '../db/index';
import { workspaces } from '../db/schema';
import { eq, and, isNull } from 'drizzle-orm';

const workspacesRouter = new Hono();

// GET / - Get workspace by ID
workspacesRouter.get('/', async (c) => {
  try {
    const workspaceId = c.req.query('workspaceId');
    if (!workspaceId) {
      return c.json({ error: 'bad_request', message: 'Missing workspaceId query parameter' }, 400);
    }

    const [workspace] = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        slug: workspaces.slug,
        orgId: workspaces.orgId,
      })
      .from(workspaces)
      .where(
        and(
          eq(workspaces.id, workspaceId),
          isNull(workspaces.deletedAt)
        )
      )
      .limit(1);

    if (!workspace) {
      return c.json({ error: 'not_found', message: 'Workspace not found' }, 404);
    }

    return c.json(workspace, 200);
  } catch (error) {
    console.error('Failed to fetch workspace:', error);
    return c.json({ error: 'internal_error', message: 'Failed to fetch workspace' }, 500);
  }
});

export default workspacesRouter;
