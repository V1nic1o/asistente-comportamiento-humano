// src/controllers/chatbot.controller.js
const { trainModel, predictIntent } = require('../services/nlpModel');
const { ejecutarInferencia } = require('../services/ruleEngine');
const { getSessionContext, updateSessionContext } = require('../services/sessionContext');
const IntentFlow = require('../models/IntentFlow');

let classifier = null;

exports.handleMessage = async (req, res) => {
  const { message, sessionId, emocion = null, detalle = null } = req.body;

  if (!message || typeof message !== 'string' || !sessionId) {
    return res.status(400).json({ message: 'Faltan datos: mensaje o sesión inválida' });
  }

  try {
    if (!classifier) {
      classifier = await trainModel();
    }

    const result = await predictIntent(classifier, message);
    const { intent } = result;

    // Obtener contexto previo desde la BD
    const contextoPrevio = await getSessionContext(sessionId);
    const expected = contextoPrevio.nextExpectedIntent;

    // Evaluar si se está siguiendo el flujo esperado
    let flujo = null;
    if (expected && intent === expected) {
      flujo = `✅ Gracias por continuar. Has cumplido con la intención esperada: "${expected}".`;
    } else if (expected && intent !== expected) {
      flujo = `⚠️ Esperaba que respondieras con algo relacionado a "${expected}", ¿quieres continuar o cambiar de tema?`;
    }

    // Buscar si hay un flujo configurado para esta intención
    let nextExpected = null;
    const flujoConfig = await IntentFlow.findOne({ where: { fromIntent: intent } });
    if (flujoConfig) {
      nextExpected = flujoConfig.toIntent;
    }

    // Excluir nextExpectedIntent del contexto antes de usarlo como facts
    const { nextExpectedIntent, ...contextFacts } = contextoPrevio;

    // Construir hechos para inferencia lógica
    const facts = {
      ...contextFacts,
      intencion: intent,
      emocion: emocion || contextFacts.emocion || null,
      detalle: detalle || contextFacts.detalle || null
    };

    const inferencia = await ejecutarInferencia(facts);

    // Actualizar contexto + siguiente intención esperada
    await updateSessionContext(sessionId, {
      intencion: intent,
      emocion: facts.emocion,
      detalle: facts.detalle
    }, nextExpected);

    res.json({
      intent,
      answer:
        typeof flujo === 'string' ? flujo
        : typeof inferencia === 'string' ? inferencia
        : typeof result.response === 'string' ? result.response
        : 'Lo siento, no entendí tu mensaje.'
    });

  } catch (err) {
    console.error('Error procesando mensaje ML + lógica + contexto:', err);
    res.status(500).json({ message: 'Error interno en el chatbot' });
  }
};

exports.trainModel = async (req, res) => {
  try {
    classifier = await trainModel();
    res.json({ message: 'Modelo ML entrenado con éxito' });
  } catch (err) {
    console.error('Error al entrenar modelo ML:', err);
    res.status(500).json({ message: 'Error al entrenar modelo' });
  }
};
