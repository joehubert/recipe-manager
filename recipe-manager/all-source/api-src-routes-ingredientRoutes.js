const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');

// Define routes for ingredients
router.post('/', ingredientController.create);
router.get('/', ingredientController.getAll);

module.exports = router;