const path = require('path');
const cors = require('cors');
const jsonServer = require('json-server');
const auth = require('json-server-auth');

try {
  require('dotenv').config();
} catch {}

// Server configuration
const PORT = process.env.PORT || 4000;
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-super-secret-change-me';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Initialize JSON Server
const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Load access rules
const rules = require('./rules.json');
const rewriter = auth.rewriter(rules);

// Connect db to app 
app.db = router.db;

// Middleware setup
app.use(cors());
app.use(jsonServer.bodyParser);
app.use(middlewares);

// Apply auth URL rewriting and authentication
app.use(rewriter);
app.use(auth);

// Use the main router 
app.use(router);

// Start the server
app.listen(PORT, () => {
  console.log(`✅ JSON Auth API running at http://localhost:${PORT}`);
});
