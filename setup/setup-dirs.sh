#!/bin/bash

# Recipe Manager Application Setup Script
# This script creates a directory structure for the Recipe Manager project

# Exit on error
set -e

# Define the base directory
BASE_DIR="recipe-manager"

# Create the base directory
mkdir -p $BASE_DIR
cd $BASE_DIR

echo "Creating directory structure for Recipe Manager Application..."

# Create docker-compose and main config files
touch docker-compose.yml
touch .env
touch README.md

# Create database directory with its subdirectories
mkdir -p database/migrations
mkdir -p database/seeds
mkdir -p database/scripts

# Create database Dockerfile
cat > database/Dockerfile << 'EOF'
FROM postgres:latest

# Copy initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/
COPY migrations /docker-entrypoint-initdb.d/migrations/
COPY seeds /docker-entrypoint-initdb.d/seeds/

# Custom configuration can be added here
# COPY postgresql.conf /etc/postgresql/postgresql.conf

# Set environment variables
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_DB recipe_manager

EXPOSE 5432
EOF

# Create database initialization files
cat > database/init.sql << 'EOF'
-- This file will contain the initial database schema
-- Based on the requirements, the following tables will be created:
-- - recipe (id, name, favorite)
-- - ingredient (id, name, category, in_stock)
-- - recipe_ingredient (id, recipe_id, ingredient_id, seq, amount, units)
EOF

# Create migrations directory with a sample migration
cat > database/migrations/001_initial_schema.sql << 'EOF'
-- Initial database schema migration
EOF

# Create a README for the database directory
cat > database/README.md << 'EOF'
# Database Component

This directory contains PostgreSQL database initialization scripts, migrations, and seed data for the Recipe Manager application.

## Structure
- `init.sql` - Initial database setup script
- `migrations/` - Database migrations for version control
- `seeds/` - Seed data for testing and development
- `scripts/` - Utility scripts for database management
EOF

# Create API directory with its subdirectories
mkdir -p api/src/routes
mkdir -p api/src/models
mkdir -p api/src/controllers
mkdir -p api/src/middleware
mkdir -p api/src/utils
mkdir -p api/tests

# Create basic API files
# Create API Dockerfile
cat > api/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose API port
EXPOSE 3000

# Start the API server
CMD ["npm", "start"]
EOF
touch api/package.json
touch api/package-lock.json
touch api/.gitignore

# Create main API application file
cat > api/src/app.js << 'EOF'
// Main application entry point for the Recipe Manager API
const express = require('express');
const app = express();

// Middleware setup
app.use(express.json());

// Routes setup
// TODO: Import and configure routes for recipes and ingredients

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
EOF

# Create server file
cat > api/src/server.js << 'EOF'
// Server initialization file
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOF

# Create sample model files
cat > api/src/models/recipe.js << 'EOF'
// Recipe model
EOF

cat > api/src/models/ingredient.js << 'EOF'
// Ingredient model
EOF

cat > api/src/models/recipeIngredient.js << 'EOF'
// Recipe Ingredient junction model
EOF

# Create sample route files
cat > api/src/routes/recipeRoutes.js << 'EOF'
// Recipe routes
EOF

cat > api/src/routes/ingredientRoutes.js << 'EOF'
// Ingredient routes
EOF

# Create sample controller files
cat > api/src/controllers/recipeController.js << 'EOF'
// Recipe controller with CRUD operations
EOF

cat > api/src/controllers/ingredientController.js << 'EOF'
// Ingredient controller with CRUD operations
EOF

# Create database connection utility
cat > api/src/utils/db.js << 'EOF'
// Database connection utility
EOF

# Create a README for the API directory
cat > api/README.md << 'EOF'
# API Component

This directory contains the Node.js API for the Recipe Manager application.

## Structure
- `src/` - Source code
  - `routes/` - API route definitions
  - `controllers/` - Request handlers
  - `models/` - Data models
  - `middleware/` - Express middleware
  - `utils/` - Utility functions
- `tests/` - Test files
- `Dockerfile` - Docker configuration for the API
EOF

# Create API .gitignore file
cat > api/.gitignore << 'EOF'
# Node.js
node_modules/
npm-debug.log
yarn-debug.log
yarn-error.log

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log

# Coverage directory used by tools like istanbul
coverage

# Build output
dist/
build/

# System Files
.DS_Store
Thumbs.db
EOF

# Create UI directory with its subdirectories (placeholders since UI requirements aren't available yet)
mkdir -p ui/src/components
mkdir -p ui/src/pages
mkdir -p ui/src/assets
mkdir -p ui/src/services
mkdir -p ui/public

# Create basic UI files
# Create UI Dockerfile
cat > ui/Dockerfile << 'EOF'
FROM node:18-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# Create nginx configuration for the UI
cat > ui/nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy configuration
    location /api/ {
        proxy_pass http://api:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
touch ui/package.json
touch ui/package-lock.json
touch ui/.gitignore

# Create a README for the UI directory
cat > ui/README.md << 'EOF'
# UI Component

This directory will contain the front-end UI for the Recipe Manager application.

**Note**: Detailed UI requirements are not available yet.

## Structure
- `src/` - Source code
  - `components/` - Reusable UI components
  - `pages/` - Page components
  - `assets/` - Static assets (images, fonts, etc.)
  - `services/` - API service integrations
- `public/` - Public static files
- `Dockerfile` - Docker configuration for the UI
EOF

# Create docker-compose.yml file
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # Database service
  db:
    build: ./database
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_DB: ${DB_NAME:-recipe_manager}
    ports:
      - "${DB_PORT:-5432}:5432"
    restart: unless-stopped

  # API service
  api:
    build: ./api
    depends_on:
      - db
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      PORT: ${API_PORT:-3000}
      DB_HOST: db
      DB_PORT: 5432
      DB_USER: ${DB_USER:-postgres}
      DB_PASSWORD: ${DB_PASSWORD:-postgres}
      DB_NAME: ${DB_NAME:-recipe_manager}
    ports:
      - "${API_PORT:-3000}:3000"
    volumes:
      - ./api:/app
      - /app/node_modules
    restart: unless-stopped

  # UI service (commented out until UI requirements are available)
  # ui:
  #   build: ./ui
  #   depends_on:
  #     - api
  #   ports:
  #     - "${UI_PORT:-8080}:80"
  #   volumes:
  #     - ./ui:/app
  #     - /app/node_modules
  #   restart: unless-stopped

volumes:
  postgres_data:
EOF

# Create .env file with default environment variables
cat > .env << 'EOF'
# Database Configuration
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=recipe_manager
DB_PORT=5432

# API Configuration
NODE_ENV=development
API_PORT=3000

# UI Configuration
UI_PORT=8080
EOF

# Create README.md file
cat > README.md << 'EOF'
# Recipe Manager Application

A personal recipe management application with a PostgreSQL database, Node.js API, and a UI frontend.

## Project Structure

- `database/` - PostgreSQL database files and migrations
- `api/` - Node.js API
- `ui/` - Frontend UI (requirements pending)
- `docker-compose.yml` - Docker Compose configuration for running the application
- `.env` - Environment variables

## Getting Started

1. Ensure Docker and Docker Compose are installed
2. Clone this repository
3. Run `docker-compose up -d` to start the services
4. Access the API at http://localhost:3000
5. When available, access the UI at http://localhost:8080

## Features

- Manage recipes and ingredients
- Track ingredient inventory
- Find recipes based on available ingredients
- Mark recipes as favorites

## Requirements

See the detailed requirements in:
- `database-requirements.txt`
- `api-requirements.txt`
- `application-requirements.txt`
- UI requirements (pending)
EOF

# Make the script executable (for local development)
touch .gitignore
cat > .gitignore << 'EOF'
.DS_Store
node_modules
.env
*.log
EOF

echo "Directory structure created successfully for Recipe Manager Application!"
echo "Project is available at: $(pwd)/$BASE_DIR"

# Show the created directory structure
echo "Directory structure:"
find . -type d | sort | sed -e 's/[^-][^\/]*\//  |/g' -e 's/|\([^ ]\)/|-\1/'