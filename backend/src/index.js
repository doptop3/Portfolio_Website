import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 5000;

// PostgreSQL setup using environment variables
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT || 5432,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

// Test route to fetch users
app.get('/api/users', async (req, res) => {
  try {
    console.log('Attempting to query DB...');
    const result = await pool.query('SELECT * FROM users');
    console.log('Query succeeded:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('DB query error:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Another example route for media data (if needed)
app.get('/api/media', async (req, res) => {
  try {
    console.log('Attempting to query media...');
    const result = await pool.query('SELECT * FROM media');
    console.log('Query succeeded:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('DB query error:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Server running at dapop.it.com:${port}`);
});
