import { Hono } from 'hono';
import onboardingRouter from './onboarding';
import connectorsRouter from './connectors';

const apiRouter = new Hono();

// Mount onboarding router under /api/v1/onboarding -> will map to /api/v1/onboarding/complete
apiRouter.route('/api/v1/onboarding', onboardingRouter);

// Mount connectors router under /api/v1/connectors
apiRouter.route('/api/v1/connectors', connectorsRouter);

export default apiRouter;
