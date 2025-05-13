const IntentFlow = require('../models/IntentFlow');

// Obtener todos los flujos
exports.getAllFlows = async (req, res) => {
  try {
    const flows = await IntentFlow.findAll({ order: [['fromIntent', 'ASC']] });
    res.json(flows);
  } catch (err) {
    console.error('Error al obtener flujos:', err);
    res.status(500).json({ message: 'Error al obtener flujos' });
  }
};

// Crear nuevo flujo
exports.createFlow = async (req, res) => {
  const { fromIntent, toIntent } = req.body;
  if (!fromIntent || !toIntent) {
    return res.status(400).json({ message: 'Faltan intenciones' });
  }

  try {
    const exists = await IntentFlow.findOne({ where: { fromIntent, toIntent } });
    if (exists) {
      return res.status(400).json({ message: 'Este flujo ya existe' });
    }

    const newFlow = await IntentFlow.create({ fromIntent, toIntent });
    res.status(201).json(newFlow);
  } catch (err) {
    console.error('Error al crear flujo:', err);
    res.status(500).json({ message: 'Error al crear flujo' });
  }
};

// Eliminar flujo
exports.deleteFlow = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await IntentFlow.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Flujo no encontrado' });
    }
    res.json({ message: 'Flujo eliminado' });
  } catch (err) {
    console.error('Error al eliminar flujo:', err);
    res.status(500).json({ message: 'Error al eliminar flujo' });
  }
};
