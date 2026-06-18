const db = require('../config/database');
const { cacheGet, cacheSet, cacheDel, cacheDelPattern, CACHE_TTL } = require('../config/redis');

const KEYS = {
  all: 'products:all',
  one: (id) => `products:${id}`,
  byCategory: (cat) => `products:category:${cat}`,
};

const findAll = async () => {
  const cached = await cacheGet(KEYS.all);
  if (cached) {
    console.log('🟡 [PRODUCTS] Cache HIT - listagem');
    return { data: cached, fromCache: true };
  }

  console.log('🔵 [PRODUCTS] Cache MISS - buscando no banco');
  const { rows } = await db.query('SELECT * FROM products ORDER BY id');
  await cacheSet(KEYS.all, rows, CACHE_TTL);
  return { data: rows, fromCache: false };
};

const findById = async (id) => {
  const cached = await cacheGet(KEYS.one(id));
  if (cached) {
    console.log(`🟡 [PRODUCTS] Cache HIT - produto ${id}`);
    return { data: cached, fromCache: true };
  }

  console.log(`🔵 [PRODUCTS] Cache MISS - buscando produto ${id} no banco`);
  const { rows } = await db.query('SELECT * FROM products WHERE id = $1', [id]);
  if (rows.length === 0) return null;

  await cacheSet(KEYS.one(id), rows[0], CACHE_TTL);
  return { data: rows[0], fromCache: false };
};

const findByCategory = async (category) => {
  const cached = await cacheGet(KEYS.byCategory(category));
  if (cached) {
    console.log(`🟡 [PRODUCTS] Cache HIT - categoria ${category}`);
    return { data: cached, fromCache: true };
  }

  console.log(`🔵 [PRODUCTS] Cache MISS - buscando categoria ${category} no banco`);
  const { rows } = await db.query(
    'SELECT * FROM products WHERE category ILIKE $1 ORDER BY id',
    [category]
  );
  await cacheSet(KEYS.byCategory(category), rows, CACHE_TTL);
  return { data: rows, fromCache: false };
};

const create = async ({ name, description, price, stock, category }) => {
  const { rows } = await db.query(
    'INSERT INTO products (name, description, price, stock, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, description, price, stock || 0, category]
  );
  await cacheDelPattern('products:*');
  console.log('🗑️  [PRODUCTS] Cache invalidado após criação');
  return rows[0];
};

const update = async (id, { name, description, price, stock, category }) => {
  const { rows } = await db.query(
    'UPDATE products SET name=$1, description=$2, price=$3, stock=$4, category=$5 WHERE id=$6 RETURNING *',
    [name, description, price, stock, category, id]
  );
  if (rows.length === 0) return null;
  await cacheDel(KEYS.one(id));
  await cacheDel(KEYS.all);
  await cacheDelPattern('products:category:*');
  console.log(`🗑️  [PRODUCTS] Cache invalidado após atualização do produto ${id}`);
  return rows[0];
};

const remove = async (id) => {
  const { rows } = await db.query('DELETE FROM products WHERE id=$1 RETURNING *', [id]);
  if (rows.length === 0) return null;
  await cacheDel(KEYS.one(id));
  await cacheDelPattern('products:*');
  console.log(`🗑️  [PRODUCTS] Cache invalidado após remoção do produto ${id}`);
  return rows[0];
};

module.exports = { findAll, findById, findByCategory, create, update, remove };
