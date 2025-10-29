const path = require('path');
// Load environment variables from .env files at project root
try {
  require('dotenv').config();
} catch {}
const cors = require('cors');
const jsonServer = require('json-server');
const auth = require('json-server-auth');
 
const PORT = process.env.PORT || 4000;
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-super-secret-change-me';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
 
const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
 
app.db = router.db;
 
app.use(cors());
app.use(jsonServer.bodyParser);
app.use(middlewares);
 
const rules = require('./rules.json');
const rewriter = auth.rewriter(rules);
app.use(rewriter);
 
app.use(auth);
 
app.post('/profiles:ensure', (req, res) => {
  return res.status(404).json({ error: 'Not implemented' });
});
 
app.get('/me/profile', (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' }); 
    return res.status(400).json({ error: 'Use /profiles?userId={id} instead' });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});
 
app.use(router);

app.listen(PORT, () => {
  console.log(`JSON Auth API running on http://localhost:${PORT}`);
});


