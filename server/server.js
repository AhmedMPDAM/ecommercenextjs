const path = require('path');
const cors = require('cors');
const jsonServer = require('json-server');
const auth = require('json-server-auth');

// Environment
const PORT = process.env.PORT || 4000;
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-super-secret-change-me';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Create server
const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Attach DB to app for json-server-auth
app.db = router.db;

// CORS and body parser
app.use(cors());
app.use(jsonServer.bodyParser);
app.use(middlewares);

// Ownership rules: only owners can read/write their resources
const rules = require('./rules.json');
const rewriter = auth.rewriter(rules);
app.use(rewriter);

// Auth middleware (provides /register and /login with JWT)
app.use(auth);

// Helper: ensure a profile exists for the authenticated user
app.post('/profiles:ensure', (req, res) => {
  return res.status(404).json({ error: 'Not implemented' });
});

// Example secure self routes (optional):
// GET /me/profile -> current user's profile
app.get('/me/profile', (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    // json-server-auth keeps the current user id in token sub; we cannot decode without secret here simply.
    // Simpler pattern on client: call GET /profiles?userId={currentUserId}
    return res.status(400).json({ error: 'Use /profiles?userId={id} instead' });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Mount router last
app.use(router);

app.listen(PORT, () => {
  console.log(`JSON Auth API running on http://localhost:${PORT}`);
});


