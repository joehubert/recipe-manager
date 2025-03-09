-- This file will contain the initial database schema
-- Based on the requirements, the following tables will be created:
-- - recipe (id, name, favorite)
-- - ingredient (id, name, category, in_stock)
-- - recipe_ingredient (id, recipe_id, ingredient_id, seq, amount, units)

-- Recipe Manager Database Initialization Script

-- Create the database if it doesn't exist
-- This will run only if this script is executed as postgres user
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'recipe_manager') THEN
        CREATE DATABASE recipe_manager;
    END IF;
END
$$;

-- Connect to the recipe_manager database
\c recipe_manager

-- Create a function to log migrations
CREATE OR REPLACE FUNCTION log_migration(migration_file TEXT) RETURNS VOID AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'schema_migrations') THEN
        CREATE TABLE schema_migrations (
            id SERIAL PRIMARY KEY,
            migration_file TEXT NOT NULL,
            applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    END IF;

    INSERT INTO schema_migrations (migration_file) VALUES (migration_file);
END;
$$ LANGUAGE plpgsql;

-- Apply migrations
\echo 'Applying migration: 001_initial_schema.sql'
\i /docker-entrypoint-initdb.d/migrations/001_initial_schema.sql
SELECT log_migration('001_initial_schema.sql');

-- Additional migrations would be added here in sequence
-- \echo 'Applying migration: 002_add_new_feature.sql'
-- \i /docker-entrypoint-initdb.d/migrations/002_add_new_feature.sql
-- SELECT log_migration('002_add_new_feature.sql');

\echo 'All migrations applied successfully!'

-- Create application user with appropriate permissions
-- Uncomment and modify if you want to create a specific user for your application
-- CREATE USER recipe_app WITH PASSWORD 'your_secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE recipe_manager TO recipe_app;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO recipe_app;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO recipe_app;
