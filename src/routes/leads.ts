import { Hono } from 'hono';
import { db } from '../db/index';
import { unifiedLeads } from '../db/schema';
import { eq, and, or, ilike, desc, sql, gte, isNotNull } from 'drizzle-orm';

const leadsRouter = new Hono();

// GET / - Get paginated leads with filtering
leadsRouter.get('/', async (c) => {
  try {
    const workspaceId = c.req.query('workspaceId');
    if (!workspaceId) {
      return c.json({ error: 'bad_request', message: 'Missing workspaceId query parameter' }, 400);
    }

    const page = Math.max(1, parseInt(c.req.query('page') || '1', 10));
    const limit = Math.max(1, parseInt(c.req.query('limit') || '50', 10));
    const stage = c.req.query('stage');
    const search = c.req.query('search');

    const conditions = [eq(unifiedLeads.workspaceId, workspaceId)];

    if (stage && stage !== 'All') {
      conditions.push(eq(unifiedLeads.stageRaw, stage));
    }

    if (search) {
      const searchPattern = `%${search}%`;
      conditions.push(
        or(
          ilike(unifiedLeads.name, searchPattern)!,
          ilike(unifiedLeads.email, searchPattern)!,
          ilike(unifiedLeads.phone, searchPattern)!
        )!
      );
    }

    const whereClause = and(...conditions);

    // Get total count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(unifiedLeads)
      .where(whereClause!);

    const total = Number(countResult?.count || 0);

    // Get paginated leads
    const offset = (page - 1) * limit;
    const leads = await db
      .select({
        id: unifiedLeads.id,
        externalId: unifiedLeads.externalId,
        sourceTool: unifiedLeads.sourceTool,
        name: unifiedLeads.name,
        email: unifiedLeads.email,
        phone: unifiedLeads.phone,
        stageRaw: unifiedLeads.stageRaw,
        dealValueInr: unifiedLeads.dealValueInr,
        adPlatform: unifiedLeads.adPlatform,
        campaignId: unifiedLeads.campaignId,
        utmSource: unifiedLeads.utmSource,
        utmMedium: unifiedLeads.utmMedium,
        utmCampaign: unifiedLeads.utmCampaign,
        agentId: unifiedLeads.agentId,
        createdAt: unifiedLeads.createdAt,
        stageUpdatedAt: unifiedLeads.stageUpdatedAt,
      })
      .from(unifiedLeads)
      .where(whereClause!)
      .orderBy(desc(unifiedLeads.createdAt))
      .limit(limit)
      .offset(offset);

    // Map dealValueInr numeric strings/floats to numbers or preserve them
    const formattedLeads = leads.map((lead: any) => ({
      ...lead,
      dealValueInr: lead.dealValueInr ? Number(lead.dealValueInr) : null,
    }));

    return c.json({
      leads: formattedLeads,
      total,
      page,
      limit,
    }, 200);
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    return c.json({ error: 'internal_error', message: 'Failed to fetch leads' }, 500);
  }
});

// GET /stats - Get lead stats for dashboard
leadsRouter.get('/stats', async (c) => {
  try {
    const workspaceId = c.req.query('workspaceId');
    if (!workspaceId) {
      return c.json({ error: 'bad_request', message: 'Missing workspaceId query parameter' }, 400);
    }

    // 1. Total Leads
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(unifiedLeads)
      .where(eq(unifiedLeads.workspaceId, workspaceId));
    
    const totalLeads = Number(totalResult?.count || 0);

    // 2. New This Month (sourced_at in current month, UTC)
    const [newResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(unifiedLeads)
      .where(
        and(
          eq(unifiedLeads.workspaceId, workspaceId),
          sql`sourced_at >= date_trunc('month', now() AT TIME ZONE 'UTC') AND sourced_at < date_trunc('month', now() AT TIME ZONE 'UTC') + interval '1 month'`
        )
      );

    const newThisMonth = Number(newResult?.count || 0);

    // 3. Stage breakdown grouped by stageRaw, ignoring nulls
    const rawBreakdown = await db
      .select({
        stageRaw: unifiedLeads.stageRaw,
        count: sql<number>`count(*)`
      })
      .from(unifiedLeads)
      .where(
        and(
          eq(unifiedLeads.workspaceId, workspaceId),
          isNotNull(unifiedLeads.stageRaw)
        )
      )
      .groupBy(unifiedLeads.stageRaw);

    const stageBreakdown = rawBreakdown.map((row: any) => ({
      stageRaw: row.stageRaw as string,
      count: Number(row.count || 0),
    }));

    return c.json({
      totalLeads,
      newThisMonth,
      stageBreakdown,
    }, 200);
  } catch (error) {
    console.error('Failed to fetch lead stats:', error);
    return c.json({ error: 'internal_error', message: 'Failed to fetch lead stats' }, 500);
  }
});

export default leadsRouter;
