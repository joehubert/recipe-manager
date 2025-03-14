// Main application entry point for the Recipe Manager API
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line

// Configure CORS middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware setup
app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes setup
const recipeRoutes = require('./routes/recipeRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');

// Use routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/ingredients', ingredientRoutes);

// Debug route
app.get('/debug', (req, res) => {
  const routes = app._router.stack
    .filter(r => r.route)
    .map(r => r.route.path)
    .concat(
      recipeRoutes.stack.map(r => '/api/recipes' + r.route.path),
      ingredientRoutes.stack.map(r => '/api/ingredients' + r.route.path)
    );
  res.status(200).json({ routes });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
