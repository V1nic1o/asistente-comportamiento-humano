const express = require('express');
const router = express.Router();
const controller = require('../controllers/intentFlow.controller');

router.get('/', controller.getAllFlows);
router.post('/', controller.createFlow);
router.delete('/:id', controller.deleteFlow);

module.exports = router;
