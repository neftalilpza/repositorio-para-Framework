const { Router } = require('express');

const { buscar } = require('../controllers/buscar');
const { validarJWT, datosCompletos } = require('../middlewares');


const router =  Router();

router.get('/:coleccion/:termino',[validarJWT, datosCompletos], buscar);




 
module.exports= router;


   