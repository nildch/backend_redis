require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));


app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.get('/api/cache/info', async (req, res) => {
  const { redis } = require('./config/redis');
  try {
    const info = await redis.info('memory');
    const keys = await redis.dbsize();
    const allKeys = await redis.keys('*');
    res.json({
      status: 'ok',
      totalKeys: keys,
      keys: allKeys,
      memoryUsage: info.match(/used_memory_human:(.+)/)?.[1]?.trim(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete('/api/cache', async (req, res) => {
  const { redis } = require('./config/redis');
  try {
    await redis.flushdb();
    res.json({ success: true, message: 'Cache limpo com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📦 Entidades com cache: Users, Products`);
  console.log(`🔴 Redis: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
  console.log(`🐘 PostgreSQL: ${process.env.DB_HOST}:${process.env.DB_PORT}\n`);
});

module.exports = app;
