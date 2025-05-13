// src/routes/intent.routes.js
const express = require('express');
const router = express.Router();
const intentController = require('../controllers/intent.controller');

// Obtener todas las intenciones
router.get('/', intentController.getAllIntents);

// Crear una nueva intención
router.post('/', intentController.createIntent);

// Actualizar una intención existente
router.put('/:id', intentController.updateIntent);

// Eliminar una intención
router.delete('/:id', intentController.deleteIntent);

// Agregar frase a una intención existente
router.post('/:id/phrases', intentController.addPhrase);

// Eliminar una frase específica por índice
router.delete('/:id/phrases/:index', intentController.deletePhrase);

module.exports = router;
