// src/services/learningEngine.js
const UnknownPhrase = require('../models/UnknownPhrase');

// Detecta si una frase contiene una palabra desconocida y genera una pregunta
function generarPreguntaDeAprendizaje(frase) {
  const palabras = frase.split(' ');

  // Busca una palabra clave que el bot podría no conocer (muy simplificado)
  for (let palabra of palabras) {
    palabra = palabra.toLowerCase().replace(/[.?!,;]/g, '');
    if (!['hola', 'gracias', 'cómo', 'estás', 'bien', 'me', 'siento', 'quiero', 'necesito'].includes(palabra)) {
      return `¿Quién o qué es "${palabra}"?`;
    }
  }

  return '¿Podrías explicarme mejor a qué te refieres?';
}

// Guarda la frase desconocida en la base de datos
async function guardarFraseDesconocida({ phrase, sessionId }) {
  await UnknownPhrase.create({
    phrase,
    sessionId,
    explanation: null,
    intentSuggested: null,
  });
}

module.exports = {
  generarPreguntaDeAprendizaje,
  guardarFraseDesconocida,
};
