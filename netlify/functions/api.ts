import express from 'express';
import serverless from 'serverless-http';
import { registerApiRoutes } from '../../src/server/createApiApp';

const app = express();
app.use(express.json({ limit: '15mb' }));

const apiRouter = express.Router();
registerApiRoutes(apiRouter);

// Support both direct '/api/*' paths and Netlify functions path rewriting
app.use('/api', apiRouter);
app.use('/.netlify/functions/api', apiRouter);
app.use('/', apiRouter);

export const handler = serverless(app);
