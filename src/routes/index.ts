import { Hono } from 'hono';
import onboardingRouter from './onboarding';
import connectorsRouter from './connectors';
import workspacesRouter from './workspaces';
import pipelineRunsRouter from './pipeline-runs';
import syncRouter from './sync';

const apiRouter = new Hono();

// Mount onboarding router under /api/v1/onboarding -> will map to /api/v1/onboarding/complete
apiRouter.route('/api/v1/onboarding', onboardingRouter);

// Mount connectors router under /api/v1/connectors
apiRouter.route('/api/v1/connectors', connectorsRouter);

// Mount workspaces router under /api/v1/workspaces
apiRouter.route('/api/v1/workspaces', workspacesRouter);

// Mount pipeline-runs router under /api/v1/pipeline-runs
apiRouter.route('/api/v1/pipeline-runs', pipelineRunsRouter);

// Mount sync router under /api/v1/sync -> will map to /api/v1/sync/:connectorId
apiRouter.route('/api/v1/sync', syncRouter);

export default apiRouter;
