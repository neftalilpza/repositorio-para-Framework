
const { Router } = require('express');
const { check } = require('express-validator');

/**
 *  Los Middlewares
 */
const {
   validarCampos,
   validarJWT,
   tieneRole,
   datosCompletos,
}= require('../middlewares/index')

/**
 *  Los Validadores
 */

const  {
  existeApoyoPorId, 
  existeApoyoActivoPorId,
}= require('../helpers/db-validators');

/** 
 *  Controladores 
 */

const {
   obtenerApoyos,
   obtenerApoyo,
     crearApoyo,
actualizarApoyo,
  eliminarApoyo    
} = require('../controllers/apoyos');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerApoyos);

/**
 * Obtener Un Registro
 */
router.get('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeApoyoPorId),

    validarCampos,
], obtenerApoyo);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
   tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,
   check('titulo','El título es obligatorio').not().isEmpty(),
   check('descripcion','La descripciòn es obligatoria').not().isEmpty(),
   check('requisitos','Los requisitos son obligatorios').not().isEmpty(),
   check('enlace','El enlace es obligatorio').not().isEmpty(),  
    validarCampos,

], crearApoyo);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
   validarJWT,
   tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
    check('id','No es un ID válido').isMongoId(),
    
    check('id').custom(existeApoyoPorId),
    check('id').custom(existeApoyoActivoPorId),

    check('titulo','El título es obligatorio').not().isEmpty(),
    check('descripcion','La descripciòn es obligatoria').not().isEmpty(),
    check('requisitos','Los requisitos son obligatorios').not().isEmpty(),
    check('enlace','El enlace es obligatorio').not().isEmpty(),
    validarCampos,

], actualizarApoyo);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeApoyoPorId),
    check('id').custom(existeApoyoActivoPorId),

    validarCampos,

], eliminarApoyo);





module.exports = router;

