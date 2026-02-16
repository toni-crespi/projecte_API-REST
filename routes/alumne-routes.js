const express = require('express');
const router = express.Router();

const alumneController = require('../controllers/alumne-controller');

router.get('/', alumneController.llistaAlumnes);

router.get('/matriculats-iaw', alumneController.llistaAlumnesMatriculatsIAW);

router.post('/calculate', alumneController.calcularNotes);

module.exports = router;