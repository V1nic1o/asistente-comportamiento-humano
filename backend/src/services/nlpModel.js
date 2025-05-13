// src/services/nlpModel.js
const natural = require('natural');
const Intent = require('../models/Intent');

let classifier = null; // Variable global para conservar modelo

// Entrena el modelo con frases e intenciones desde la BD
async function trainModel() {
  const intents = await Intent.findAll();

  classifier = new natural.BayesClassifier();

  intents.forEach((intent) => {
    console.log('🧠 Entrenando intención:', intent.tag);
    intent.phrases.forEach((phrase) => {
      console.log('   → frase:', phrase);
      classifier.addDocument(phrase.toLowerCase(), intent.tag);
    });
  });

  classifier.train();
  console.log('✅ Modelo NLP entrenado con éxito con', classifier.docs.length, 'frases');
  return classifier;
}

// Predice intención desde una frase y devuelve una respuesta aleatoria asociada
async function predictIntent(model, message) {
  if (!model || model.docs.length === 0) {
    console.warn('⚠️ Modelo NLP vacío o no entrenado.');
    return { intent: null, response: null };
  }

  const intent = model.classify(message.toLowerCase());
  const response = await getRandomResponse(intent);

  return {
    intent,
    response,
  };
}

// Elige una respuesta aleatoria del array de respuestas de la intención
async function getRandomResponse(tag) {
  try {
    const intent = await Intent.findOne({ where: { tag } });
    if (!intent || !intent.response || intent.response.length === 0) return null;

    const index = Math.floor(Math.random() * intent.response.length);
    return intent.response[index];
  } catch (err) {
    console.error('Error buscando respuesta para intención:', tag, err);
    return null;
  }
}

module.exports = {
  trainModel,
  predictIntent,
};
