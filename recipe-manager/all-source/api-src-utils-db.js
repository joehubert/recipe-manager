// Database connection utility
const { Pool } = require('pg');

// Create a PostgreSQL connection pool using environment variables
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'database',
    database: process.env.DB_NAME || 'recipe_manager',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
});

// Test the database connection on startup
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Database connected successfully');
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    getClient: async () => {
        const client = await pool.connect();
        const query = client.query;
        const release = client.release;

        // Set a timeout of 5 seconds on idle clients
        const timeout = setTimeout(() => {
            console.error('A client has been checked out for too long.');
            console.error(`The last executed query was: ${client.lastQuery}`);
        }, 5000);

        // Monkey patch the query method to track the last query executed
        client.query = (...args) => {
            client.lastQuery = args;
            return query.apply(client, args);
        };

        client.release = () => {
            clearTimeout(timeout);
            client.query = query;
            client.release = release;
            return release.apply(client);
        };

        return client;
    }
};