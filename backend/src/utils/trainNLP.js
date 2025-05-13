// src/utils/trainNLP.js
const { NlpManager } = require('node-nlp');
const Intent = require('../models/Intent');

async function trainChatbot() {
  const manager = new NlpManager({ languages: ['es'], forceNER: true });

  const intents = await Intent.findAll();

  intents.forEach((intent) => {
    if (Array.isArray(intent.phrases)) {
      intent.phrases.forEach((phrase) => {
        if (typeof phrase === 'string' && phrase.trim()) {
          manager.addDocument('es', phrase.trim(), intent.tag);
        }
      });
    }

    if (intent.response) {
      manager.addAnswer('es', intent.tag, intent.response);
    }
  });

  await manager.train();
  manager.save();
  return manager;
}

module.exports = trainChatbot;
