// Mock data - initialize once, persist between invocations
const users = [
  { id: 1, email: 'admin@example.com', password: 'admin123', name: 'Admin User' },
  { id: 2, email: 'user@example.com', password: 'user123', name: 'Regular User' }
];

const mockTasks = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `Task ${i + 1}`,
  description: `Description for task ${i + 1}. This is a sample task with some details.`,
  status: ['pending', 'in-progress', 'completed'][i % 3],
  priority: ['low', 'medium', 'high'][i % 3],
  dueDate: new Date(Date.now() + (i * 24 * 60 * 60 * 1000)).toISOString(),
  createdAt: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString()
}));

// Initialize tasks array once - will persist between function invocations
let tasks = [...mockTasks];
const MOCK_TOKEN = 'mock.jwt.token.12345';

export const handler = async (event, context) => {
  console.log('=== API Function Called ===');
  console.log('Event path:', event.path);
  console.log('Event httpMethod:', event.httpMethod);
  console.log('Event body:', event.body);
  
  try {
    // Import and use the express app
    const express = await import('express');
    const serverless = await import('serverless-http');
    
    const app = express.default();
    app.use(express.default.json());

    // Enable CORS
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      if (req.method === 'OPTIONS') {
        res.status(200).send();
        return;
      }
      next();
    });

    // Auth middleware
    const authenticateToken = (req, res, next) => {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'Access token required' });
      }

      if (token !== MOCK_TOKEN) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      next();
    };
    
    app.get('/', (req, res) => {
      res.json({ 
        message: 'API Root - function is working!', 
        path: req.path,
        url: req.url,
        originalUrl: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    });

    app.get('/api', (req, res) => {
      res.json({ 
        message: 'API endpoint is working!',
        version: '1.0.0',
        endpoints: ['/api/login', '/api/tasks'],
        timestamp: new Date().toISOString()
      });
    });

    // Debug all requests
    app.use((req, res, next) => {
      console.log(`Express received: ${req.method} ${req.path} (url: ${req.url})`);
      next();
    });
    
    // Handle both /login and /api/login paths
    app.post('/login', (req, res) => {
      const { email, password } = req.body;
      if (email === 'admin@example.com' && password === 'admin123') {
        res.json({ token: 'mock.jwt.token.12345', user: { id: 1, email, name: 'Admin User' } });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });

    app.post('/api/login', (req, res) => {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        token: MOCK_TOKEN,
        user: userWithoutPassword
      });
    });

    // Tasks endpoints
    app.get('/tasks', authenticateToken, (req, res) => {
      const { 
        page = 1, 
        limit = 10, 
        sort = 'createdAt', 
        order = 'desc', 
        status, 
        priority, 
        q 
      } = req.query;

      let filteredTasks = [...tasks];

      // Apply filters
      if (status) {
        filteredTasks = filteredTasks.filter(task => task.status === status);
      }

      if (priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === priority);
      }

      if (q) {
        const searchQuery = q.toLowerCase();
        filteredTasks = filteredTasks.filter(task => 
          task.title.toLowerCase().includes(searchQuery) || 
          task.description.toLowerCase().includes(searchQuery)
        );
      }

      // Apply sorting
      filteredTasks.sort((a, b) => {
        let aVal = a[sort];
        let bVal = b[sort];

        if (sort === 'createdAt' || sort === 'updatedAt' || sort === 'dueDate') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }

        if (order === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });

      // Apply pagination
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;

      const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

      res.json({
        data: paginatedTasks,
        meta: {
          total: filteredTasks.length,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(filteredTasks.length / limitNum)
        }
      });
    });

    app.get('/api/tasks', authenticateToken, (req, res) => {
      const { 
        page = 1, 
        limit = 10, 
        sort = 'createdAt', 
        order = 'desc', 
        status, 
        priority, 
        q 
      } = req.query;

      let filteredTasks = [...tasks];

      // Apply filters
      if (status) {
        filteredTasks = filteredTasks.filter(task => task.status === status);
      }

      if (priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === priority);
      }

      if (q) {
        const searchQuery = q.toLowerCase();
        filteredTasks = filteredTasks.filter(task => 
          task.title.toLowerCase().includes(searchQuery) || 
          task.description.toLowerCase().includes(searchQuery)
        );
      }

      // Apply sorting
      filteredTasks.sort((a, b) => {
        let aVal = a[sort];
        let bVal = b[sort];

        if (sort === 'createdAt' || sort === 'updatedAt' || sort === 'dueDate') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }

        if (order === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });

      // Apply pagination
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;

      const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

      res.json({
        data: paginatedTasks,
        meta: {
          total: filteredTasks.length,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(filteredTasks.length / limitNum)
        }
      });
    });

    app.post('/tasks', authenticateToken, (req, res) => {
      const { title, description, status = 'pending', priority = 'medium', dueDate } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const newTask = {
        id: Math.max(...tasks.map(t => t.id)) + 1,
        title,
        description: description || '',
        status,
        priority,
        dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      tasks.push(newTask);
      res.status(201).json(newTask);
    });

    app.post('/api/tasks', authenticateToken, (req, res) => {
      const { title, description, status = 'pending', priority = 'medium', dueDate } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const newTask = {
        id: Math.max(...tasks.map(t => t.id)) + 1,
        title,
        description: description || '',
        status,
        priority,
        dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      tasks.push(newTask);
      res.status(201).json(newTask);
    });

    app.put('/tasks/:id', authenticateToken, (req, res) => {
      const taskId = parseInt(req.params.id);
      const taskIndex = tasks.findIndex(task => task.id === taskId);

      if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const { title, description, status, priority, dueDate } = req.body;

      if (title !== undefined) tasks[taskIndex].title = title;
      if (description !== undefined) tasks[taskIndex].description = description;
      if (status !== undefined) tasks[taskIndex].status = status;
      if (priority !== undefined) tasks[taskIndex].priority = priority;
      if (dueDate !== undefined) tasks[taskIndex].dueDate = dueDate;
      
      tasks[taskIndex].updatedAt = new Date().toISOString();

      res.json(tasks[taskIndex]);
    });

    app.put('/api/tasks/:id', authenticateToken, (req, res) => {
      const taskId = parseInt(req.params.id);
      const taskIndex = tasks.findIndex(task => task.id === taskId);

      if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const { title, description, status, priority, dueDate } = req.body;

      if (title !== undefined) tasks[taskIndex].title = title;
      if (description !== undefined) tasks[taskIndex].description = description;
      if (status !== undefined) tasks[taskIndex].status = status;
      if (priority !== undefined) tasks[taskIndex].priority = priority;
      if (dueDate !== undefined) tasks[taskIndex].dueDate = dueDate;
      
      tasks[taskIndex].updatedAt = new Date().toISOString();

      res.json(tasks[taskIndex]);
    });

    app.delete('/tasks/:id', authenticateToken, (req, res) => {
      const taskId = parseInt(req.params.id);
      const taskIndex = tasks.findIndex(task => task.id === taskId);

      if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }

      tasks.splice(taskIndex, 1);
      res.status(204).send();
    });

    app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
      const taskId = parseInt(req.params.id);
      const taskIndex = tasks.findIndex(task => task.id === taskId);

      if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }

      tasks.splice(taskIndex, 1);
      res.status(204).send();
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ error: 'Not found' });
    });

    // Error handler
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Internal server error' });
    });
    
    const handler = serverless.default(app);
    return await handler(event, context);
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Function failed: ' + error.message })
    };
  }
};