const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory store
const urlStore = new Map();

// Middleware
app.use(cors());
app.use(express.json());

// POST /api/shorten — create a short URL
app.post('/api/shorten', (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Basic URL validation
  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format. Include http:// or https://' });
  }

  // Check if URL already shortened
  for (const [code, originalUrl] of urlStore) {
    if (originalUrl === url) {
      return res.json({
        shortUrl: `${req.protocol}://${req.get('host')}/${code}`,
        code,
        originalUrl: url,
      });
    }
  }

  const code = nanoid(6);
  urlStore.set(code, url);

  res.json({
    shortUrl: `${req.protocol}://${req.get('host')}/${code}`,
    code,
    originalUrl: url,
  });
});

// GET /api/urls — list all shortened URLs (for debugging / display)
app.get('/api/urls', (req, res) => {
  const urls = [];
  for (const [code, originalUrl] of urlStore) {
    urls.push({ code, originalUrl, shortUrl: `${req.protocol}://${req.get('host')}/${code}` });
  }
  res.json(urls);
});

// GET /:code — redirect to original URL
app.get('/:code', (req, res) => {
  const { code } = req.params;
  const originalUrl = urlStore.get(code);

  if (!originalUrl) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  res.redirect(302, originalUrl);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
