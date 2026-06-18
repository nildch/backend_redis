const userService = require('../services/userService');

const getAll = async (req, res) => {
  try {
    const result = await userService.findAll();
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
    const result = await userService.findById(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    res.json({ success: true, fromCache: result.fromCache, data: result.data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email) return res.status(400).json({ success: false, message: 'name e email são obrigatórios' });
    const user = await userService.create({ name, email, role });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ success: false, message: 'Email já cadastrado' });
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const user = await userService.remove(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    res.json({ success: true, message: 'Usuário removido', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
