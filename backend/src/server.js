import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { VccMiddleware } from '@withkoji/vcc';

// Import any routes we're going to be using
import routes from './routes';

// Create server
const app = express();

// Specifically enable CORS for pre-flight options requests
app.options('*', cors({
  exposedHeaders: ['x-koji-payment-required'],
}))

// Enable body parsers for reading POST data. We set up this app to 
// accept JSON bodies and x-www-form-urlencoded bodies. If you wanted to
// process other request types, like form-data or graphql, you would need
// to include the appropriate parser middlewares here.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  limit: '2mb',
  extended: true,
}));

// CORS allows these API routes to be requested directly by browsers
app.use(cors({
  exposedHeaders: ['x-koji-payment-required'],
}));

// Disable caching
app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

app.use(VccMiddleware.express);

// Enable routes we want to use
routes(app);

// Start server
app.listen(process.env.PORT || 3333, null, async err => {
  if (err) {
    console.log(err.message);
  }
  console.log('[koji] backend started');
});
