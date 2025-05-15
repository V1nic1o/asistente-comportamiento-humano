// src/services/nlpModel.js
const natural = require('natural');
const Intent = require('../models/Intent');

let classifier = null;

// Entrenar el modelo NLP desde la base de datos
async function trainModel() {
  const intents = await Intent.findAll();
  classifier = new natural.BayesClassifier();

  intents.forEach((intent) => {
    intent.phrases.forEach((phrase) => {
      classifier.addDocument(phrase.toLowerCase(), intent.tag);
    });
  });

  classifier.train();
  console.log('✅ Modelo NLP entrenado con', classifier.docs.length, 'frases');
  return classifier;
}

// Predecir la intención del mensaje y dar respuesta
async function predictIntent(model, message) {
  if (!model || model.docs.length === 0) {
    console.warn('⚠️ Modelo NLP vacío o no entrenado.');
    return { intent: null, response: null };
  }

  try {
    const intent = model.classify(message.toLowerCase());
    const response = await getRandomResponse(intent);

    if (!response) {
      console.warn('⚠️ Intención detectada pero sin respuestas:', intent);
      return { intent, response: null };
    }

    return { intent, response };
  } catch (err) {
    console.error('❌ Error al predecir intención:', err);
    return { intent: null, response: null };
  }
}

// Obtener una respuesta aleatoria de la intención
async function getRandomResponse(tag) {
  try {
    const intent = await Intent.findOne({ where: { tag } });
    if (!intent || !Array.isArray(intent.response) || intent.response.length === 0) return null;

    const index = Math.floor(Math.random() * intent.response.length);
    return intent.response[index];
  } catch (err) {
    console.error('❌ Error al buscar respuesta de la intención:', tag, err);
    return null;
  }
}

module.exports = {
  trainModel,
  predictIntent,
};
