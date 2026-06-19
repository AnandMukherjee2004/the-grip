import { Hono } from 'hono';
import { db } from '../db/index';
import { workspaces, orgMembers, organizations } from '../db/schema';
import { eq, and, isNull } from 'drizzle-orm';

const workspacesRouter = new Hono();

// GET /by-user - Get workspace and org IDs for a user ID
workspacesRouter.get('/by-user', async (c) => {
  try {
    const userId = c.req.query('userId');
    if (!userId) {
      return c.json({ error: 'bad_request', message: 'Missing userId query parameter' }, 400);
    }

    const [row] = await db
      .select({
        orgId: orgMembers.orgId,
        workspaceId: workspaces.id,
      })
      .from(orgMembers)
      .innerJoin(organizations, eq(organizations.id, orgMembers.orgId))
      .innerJoin(workspaces, eq(workspaces.orgId, organizations.id))
      .where(
        and(
          eq(orgMembers.userId, userId),
          isNull(organizations.deletedAt),
          isNull(workspaces.deletedAt)
        )
      )
      .orderBy(workspaces.createdAt)
      .limit(1);

    if (!row) {
      return c.json({ error: 'not_found', message: 'No membership or workspace found for user' }, 404);
    }

    return c.json(row, 200);
  } catch (error) {
    console.error('Failed to fetch workspace by user:', error);
    return c.json({ error: 'internal_error', message: 'Failed to fetch workspace by user' }, 500);
  }
});

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

