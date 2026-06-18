const db = require('../config/database');
const { cacheGet, cacheSet, cacheDel, cacheDelPattern, CACHE_TTL } = require('../config/redis');

const KEYS = {
  all: 'users:all',
  one: (id) => `users:${id}`,
};

const findAll = async () => {
  const cached = await cacheGet(KEYS.all);
  if (cached) {
    console.log('🟡 [USERS] Cache HIT - listagem');
    return { data: cached, fromCache: true };
  }

  console.log('🔵 [USERS] Cache MISS - buscando no banco');
  const { rows } = await db.query('SELECT * FROM users ORDER BY id');
  await cacheSet(KEYS.all, rows, CACHE_TTL);
  return { data: rows, fromCache: false };
};

const findById = async (id) => {
  const cached = await cacheGet(KEYS.one(id));
  if (cached) {
    console.log(`🟡 [USERS] Cache HIT - user ${id}`);
    return { data: cached, fromCache: true };
  }

  console.log(`🔵 [USERS] Cache MISS - buscando user ${id} no banco`);
  const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  if (rows.length === 0) return null;

  await cacheSet(KEYS.one(id), rows[0], CACHE_TTL);
  return { data: rows[0], fromCache: false };
};

const create = async ({ name, email, role }) => {
  const { rows } = await db.query(
    'INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING *',
    [name, email, role || 'user']
  );
  await cacheDelPattern('users:*');
  console.log('🗑️  [USERS] Cache invalidado após criação');
  return rows[0];
};

const update = async (id, { name, email, role }) => {
  const { rows } = await db.query(
    'UPDATE users SET name=$1, email=$2, role=$3 WHERE id=$4 RETURNING *',
    [name, email, role, id]
  );
  if (rows.length === 0) return null;
  await cacheDel(KEYS.one(id));
  await cacheDel(KEYS.all);
  console.log(`🗑️  [USERS] Cache invalidado após atualização do user ${id}`);
  return rows[0];
};

const remove = async (id) => {
  const { rows } = await db.query('DELETE FROM users WHERE id=$1 RETURNING *', [id]);
  if (rows.length === 0) return null;
  await cacheDel(KEYS.one(id));
  await cacheDel(KEYS.all);
  console.log(`🗑️  [USERS] Cache invalidado após remoção do user ${id}`);
  return rows[0];
};

module.exports = { findAll, findById, create, update, remove };
