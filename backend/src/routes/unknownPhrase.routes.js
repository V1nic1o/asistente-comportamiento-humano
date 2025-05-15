const express = require('express');
const router = express.Router();
const controller = require('../controllers/unknownPhrase.controller');

// Rutas para frases desconocidas
router.get('/', controller.getAll);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
