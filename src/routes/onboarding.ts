import { Hono } from 'hono';
import { db } from '../db/index';
import { organizations, workspaces, orgMembers } from '../db/schema';
import { eq, or } from 'drizzle-orm';

const onboardingRouter = new Hono();

onboardingRouter.post('/complete', async (c) => {
  try {
    const body = await c.req.json();
    const { orgName, orgSlug, workspaceName, workspaceSlug, clerkOrgId, clerkUserId } = body;

    // Validate request body
    if (!orgName || !orgSlug || !workspaceName || !workspaceSlug || !clerkOrgId || !clerkUserId) {
      return c.json({ error: 'bad_request', message: 'Missing required fields' }, 400);
    }

    // Check if organization slug or Clerk Org ID already exists to prevent duplicate/constraint errors
    const existingOrg = await db
      .select()
      .from(organizations)
      .where(
        or(
          eq(organizations.slug, orgSlug),
          eq(organizations.clerkOrgId, clerkOrgId)
        )
      )
      .limit(1);

    if (existingOrg.length > 0) {
      return c.json({ error: 'slug_taken' }, 409);
    }

    // Execute database operations inside a single transaction
    const result = await db.transaction(async (tx) => {
      // 1. Insert into organizations
      const [newOrg] = await tx
        .insert(organizations)
        .values({
          name: orgName,
          slug: orgSlug,
          plan: 'free',
          clerkOrgId: clerkOrgId,
        })
        .returning({ id: organizations.id });

      // 2. Insert into workspaces
      const [newWorkspace] = await tx
        .insert(workspaces)
        .values({
          orgId: newOrg.id,
          name: workspaceName,
          slug: workspaceSlug,
        })
        .returning({ id: workspaces.id });

      // 3. Insert into org_members
      await tx.insert(orgMembers).values({
        orgId: newOrg.id,
        clerkUserId: clerkUserId,
        role: 'owner',
      });

      return {
        orgId: newOrg.id,
        workspaceId: newWorkspace.id,
      };
    });

    return c.json(result, 201);
  } catch (error: any) {
    // Check for postgres unique constraint violation codes (e.g. 23505 for unique index)
    if (error.code === '23505') {
      return c.json({ error: 'slug_taken' }, 409);
    }
    
    console.error('Onboarding failed:', error);
    return c.json({ error: 'onboarding_failed' }, 500);
  }
});

export default onboardingRouter;
