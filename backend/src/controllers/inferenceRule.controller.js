const InferenceRule = require('../models/InferenceRule');

// Obtener todas las reglas
exports.getAllRules = async (req, res) => {
  try {
    const rules = await InferenceRule.findAll();
    res.json(rules);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener reglas', error: err.message });
  }
};

// Crear una nueva regla con condiciones dinámicas
exports.createRule = async (req, res) => {
  try {
    const { conditions, respuesta } = req.body;

    if (!Array.isArray(conditions) || !respuesta) {
      return res.status(400).json({ message: 'Se requieren condiciones y una respuesta' });
    }

    const rule = await InferenceRule.create({ conditions, respuesta });
    res.status(201).json(rule);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear la regla', error: err.message });
  }
};

// Eliminar una regla
exports.deleteRule = async (req, res) => {
  try {
    const rule = await InferenceRule.findByPk(req.params.id);
    if (!rule) return res.status(404).json({ message: 'Regla no encontrada' });

    await rule.destroy();
    res.json({ message: 'Regla eliminada con éxito' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar la regla', error: err.message });
  }
};
