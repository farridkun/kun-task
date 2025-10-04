import express from 'express';
import cors from 'cors';
import { handler } from './functions/api.mjs';

const app = express();

// Enable CORS for the frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Handle all API routes
app.all('/api/*', async (req, res) => {
  // Create Netlify Functions event object
  const event = {
    httpMethod: req.method,
    path: req.path.replace('/api', ''),
    headers: req.headers,
    body: JSON.stringify(req.body),
    queryStringParameters: req.query,
    isBase64Encoded: false
  };

  try {
    const result = await handler(event, {});
    
    // Send response
    const statusCode = result.statusCode || 200;
    const headers = result.headers || {};
    
    // Set headers
    Object.entries(headers).forEach(([key, value]) => {
      res.set(key, value);
    });
    
    res.status(statusCode);
    
    // Send body
    if (result.body) {
      try {
        const parsed = JSON.parse(result.body);
        res.json(parsed);
      } catch {
        res.send(result.body);
      }
    } else {
      res.end();
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📡 Frontend proxy: http://localhost:5173/api/* -> http://localhost:${PORT}/api/*`);
  console.log(`🔑 Test login: curl -X POST http://localhost:${PORT}/api/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"admin123"}'`);
});