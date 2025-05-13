// src/services/sessionContext.js
const ChatSession = require('../models/ChatSession');

// Obtener o crear contexto para una sesión
async function getOrCreateSession(sessionId) {
  let session = await ChatSession.findOne({ where: { sessionId } });

  if (!session) {
    session = await ChatSession.create({ sessionId, context: {}, nextExpectedIntent: null });
  }

  return session;
}

// Actualizar contexto con nuevos datos y posible intención esperada
async function updateSessionContext(sessionId, newData = {}, nextExpectedIntent = null) {
  const session = await getOrCreateSession(sessionId);

  session.context = { ...session.context, ...newData };

  // Si se define nextExpectedIntent, se actualiza
  if (nextExpectedIntent !== undefined) {
    session.nextExpectedIntent = nextExpectedIntent;
  }

  await session.save();

  return session.context;
}

// Obtener datos de contexto + intención esperada
async function getSessionContext(sessionId) {
  const session = await getOrCreateSession(sessionId);
  return {
    ...session.context,
    nextExpectedIntent: session.nextExpectedIntent || null
  };
}

module.exports = {
  getSessionContext,
  updateSessionContext
};
