const UnknownPhrase = require('../models/UnknownPhrase');

// Obtener todas las frases desconocidas
exports.getAll = async (req, res) => {
  try {
    const phrases = await UnknownPhrase.findAll({ order: [['createdAt', 'DESC']] });
    res.json(phrases);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener frases desconocidas' });
  }
};

// Actualizar explicación o intención sugerida
exports.update = async (req, res) => {
  const { id } = req.params;
  const { explanation, intentSuggested } = req.body;

  try {
    const phrase = await UnknownPhrase.findByPk(id);
    if (!phrase) return res.status(404).json({ message: 'Frase no encontrada' });

    phrase.explanation = explanation;
    phrase.intentSuggested = intentSuggested;
    await phrase.save();

    res.json({ message: 'Frase actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar frase' });
  }
};

// Eliminar frase
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await UnknownPhrase.destroy({ where: { id } });
    res.json({ message: 'Frase eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar frase' });
  }
};
