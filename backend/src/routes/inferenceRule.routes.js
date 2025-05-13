const express = require('express');
const router = express.Router();
const inferenceController = require('../controllers/inferenceRule.controller');

router.get('/', inferenceController.getAllRules);
router.post('/', inferenceController.createRule);
router.delete('/:id', inferenceController.deleteRule);

module.exports = router;
