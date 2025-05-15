const Intent = require('../models/Intent');

// Categorías válidas (actualizadas)
const VALID_TYPES = ['informativa', 'conversacional', 'solicitud', 'aclaracion', 'aprendizaje'];

// Obtener todas las intenciones
exports.getAllIntents = async (req, res) => {
  try {
    const intents = await Intent.findAll();
    res.json(intents);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener intenciones', error: err.message });
  }
};

// Crear una nueva intención
exports.createIntent = async (req, res) => {
  try {
    const { tag, phrases, response, type } = req.body;

    if (!tag || !phrases || !Array.isArray(phrases) || !type) {
      return res.status(400).json({ message: 'Faltan campos obligatorios o el formato es incorrecto' });
    }

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ message: 'Tipo de intención inválido' });
    }

    const newIntent = await Intent.create({
      tag,
      phrases,
      response: response || [],
      type
    });

    res.status(201).json({ message: 'Intención creada', intent: newIntent });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear intención', error: err.message });
  }
};

// Actualizar una intención existente
exports.updateIntent = async (req, res) => {
  try {
    const intent = await Intent.findByPk(req.params.id);
    if (!intent) return res.status(404).json({ message: 'Intención no encontrada' });

    const { tag, phrases, response, type } = req.body;

    if (type && !VALID_TYPES.includes(type)) {
      return res.status(400).json({ message: 'Tipo de intención inválido' });
    }

    await intent.update({
      tag: tag || intent.tag,
      phrases: phrases || intent.phrases,
      response: response !== undefined ? response : intent.response,
      type: type || intent.type
    });

    res.json({ message: 'Intención actualizada', intent });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar intención', error: err.message });
  }
};

// Eliminar una intención
exports.deleteIntent = async (req, res) => {
  try {
    const intent = await Intent.findByPk(req.params.id);
    if (!intent) return res.status(404).json({ message: 'Intención no encontrada' });

    await intent.destroy();
    res.json({ message: 'Intención eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar intención', error: err.message });
  }
};

// Agregar una frase a una intención existente
exports.addPhrase = async (req, res) => {
  try {
    const { id } = req.params;
    const { phrase } = req.body;

    if (!phrase) return res.status(400).json({ message: 'La frase es requerida' });

    const intent = await Intent.findByPk(id);
    if (!intent) return res.status(404).json({ message: 'Intención no encontrada' });

    const updatedPhrases = [...intent.phrases, phrase];
    await intent.update({ phrases: updatedPhrases });

    res.json({ message: 'Frase agregada con éxito', intent });
  } catch (err) {
    console.error('Error al agregar frase:', err);
    res.status(500).json({ message: 'Error interno al agregar frase' });
  }
};

// Eliminar una frase específica de una intención
exports.deletePhrase = async (req, res) => {
  try {
    const { id, index } = req.params;

    const intent = await Intent.findByPk(id);
    if (!intent) return res.status(404).json({ message: 'Intención no encontrada' });

    const updatedPhrases = intent.phrases.filter((_, i) => i !== parseInt(index));
    await intent.update({ phrases: updatedPhrases });

    res.json({ message: 'Frase eliminada con éxito', intent });
  } catch (err) {
    console.error('Error al eliminar frase:', err);
    res.status(500).json({ message: 'Error interno al eliminar frase' });
  }
};
