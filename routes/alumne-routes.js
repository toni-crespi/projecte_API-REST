const express = require('express');
const router = express.Router();

const alumneController = require('../controllers/alumne-controller');

// 1. Ruta per llistar tots i filtrar per nom (ex: /api/alumnes?nom=Toni)
// Aquesta ruta compleix dos dels requisits mínims.
router.get('/', alumneController.llistaAlumnes);

// 2. Ruta per obtenir un alumne per ID (ex: /api/alumnes/1)
// Aquesta ruta usa un path parameter ':id' com demana l'enunciat.
router.get('/:id', alumneController.getAlumneById);

// 3. Altres rutes del projecte
router.get('/matriculats-iaw', alumneController.llistaAlumnesMatriculatsIAW);
router.post('/calculate', alumneController.calcularNotes);

module.exports = router;