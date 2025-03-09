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
