const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
  database: process.env.DB_NAME || 'backend_db',
});

pool.on('connect', () => {
  console.log('✅ PostgreSQL conectado');
});

pool.on('error', (err) => {
  console.error('❌ Erro', err.message);
});

module.exports = pool;
