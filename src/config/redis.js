const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  retryStrategy: (times) => Math.min(times * 100, 3000),
  lazyConnect: false,
});

redis.on('connect', () => {
  console.log('✅ Redis conectado');
});

redis.on('error', (err) => {
  console.error('❌ Erro no Redis:', err.message);
});

const CACHE_TTL = parseInt(process.env.CACHE_TTL) || 60;

const cacheGet = async (key) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error(`Cache GET erro [${key}]:`, err.message);
    return null;
  }
};

const cacheSet = async (key, value, ttl = CACHE_TTL) => {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
  } catch (err) {
    console.error(`Cache SET erro [${key}]:`, err.message);
  }
};

const cacheDel = async (key) => {
  try {
    await redis.del(key);
  } catch (err) {
    console.error(`Cache DEL erro [${key}]:`, err.message);
  }
};

const cacheDelPattern = async (pattern) => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  } catch (err) {
    console.error(`Cache DEL pattern erro [${pattern}]:`, err.message);
  }
};

module.exports = { redis, cacheGet, cacheSet, cacheDel, cacheDelPattern, CACHE_TTL };
