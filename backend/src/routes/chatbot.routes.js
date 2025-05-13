// src/routes/chatbot.routes.js
const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot.controller');

// Procesar mensaje del usuario
router.post('/message', chatbotController.handleMessage);

// Reentrenar modelo manualmente
router.post('/train', chatbotController.trainModel);

module.exports = router;
