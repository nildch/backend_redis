const productService = require('../services/productService');

const getAll = async (req, res) => {
  try {
    const { category } = req.query;
    const result = category
      ? await productService.findByCategory(category)
      : await productService.findAll();
    res.json({
      success: true,
      fromCache: result.fromCache,
      count: result.data.length,
      data: result.data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const result = await productService.findById(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    res.json({ success: true, fromCache: result.fromCache, data: result.data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    if (!name || !price) return res.status(400).json({ success: false, message: 'name e price são obrigatórios' });
    const product = await productService.create({ name, description, price, stock, category });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    if (!product) return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const product = await productService.remove(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    res.json({ success: true, message: 'Produto removido', data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
