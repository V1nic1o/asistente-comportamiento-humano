const nlpService = require('../services/nlpModel');
const { ejecutarInferencia } = require('../services/ruleEngine');
const { getSessionContext, updateSessionContext } = require('../services/sessionContext');
const { generarPreguntaDeAprendizaje, guardarFraseDesconocida } = require('../services/learningEngine');
const IntentFlow = require('../models/IntentFlow');

let classifier = null;

exports.handleMessage = async (req, res) => {
  const { message, sessionId, emocion = null, detalle = null } = req.body;

  if (!message || typeof message !== 'string' || !sessionId) {
    return res.status(400).json({ message: 'Faltan datos: mensaje o sesión inválida' });
  }

  try {
    if (!classifier) {
      classifier = await nlpService.trainModel();
    }

    const result = await nlpService.predictIntent(classifier, message);
    const { intent, response } = result;

    // 📌 Si no se detecta intención, activar módulo de aprendizaje
    if (!intent || !response) {
      const pregunta = generarPreguntaDeAprendizaje(message);
      await guardarFraseDesconocida({ phrase: message, sessionId });

      return res.json({
        intent: null,
        answer: pregunta,
        learned: true
      });
    }

    // Obtener contexto previo
    const contextoPrevio = await getSessionContext(sessionId);
    const expected = contextoPrevio.nextExpectedIntent;

    // Evaluar si se sigue el flujo esperado
    let flujo = null;
    if (expected && intent === expected) {
      flujo = `✅ Gracias por continuar. Has cumplido con la intención esperada: "${expected}".`;
    } else if (expected && intent !== expected) {
      flujo = `⚠️ Esperaba que respondieras con algo relacionado a "${expected}", ¿quieres continuar o cambiar de tema?`;
    }

    // Buscar siguiente intención esperada
    let nextExpected = null;
    const flujoConfig = await IntentFlow.findOne({ where: { fromIntent: intent } });
    if (flujoConfig) {
      nextExpected = flujoConfig.toIntent;
    }

    // Hechos para inferencia
    const { nextExpectedIntent, ...contextFacts } = contextoPrevio;
    const facts = {
      ...contextFacts,
      intencion: intent,
      emocion: emocion || contextFacts.emocion || null,
      detalle: detalle || contextFacts.detalle || null
    };

    const inferencia = await ejecutarInferencia(facts);

    // Actualizar contexto
    await updateSessionContext(sessionId, {
      intencion: intent,
      emocion: facts.emocion,
      detalle: facts.detalle
    }, nextExpected);

    // Respuesta final
    res.json({
      intent,
      answer:
        typeof flujo === 'string' ? flujo
        : typeof inferencia === 'string' ? inferencia
        : typeof response === 'string' ? response
        : 'Lo siento, no entendí tu mensaje.'
    });

  } catch (err) {
    console.error('Error procesando mensaje con aprendizaje:', err);
    res.status(500).json({ message: 'Error interno en el chatbot' });
  }
};

// ✅ Reentrenamiento del modelo
exports.trainModel = async (req, res) => {
  try {
    classifier = await nlpService.trainModel();
    res.json({ message: 'Modelo ML entrenado con éxito' });
  } catch (err) {
    console.error('Error al entrenar modelo ML:', err);
    res.status(500).json({ message: 'Error al entrenar modelo' });
  }
};
