 
const { Router } = require('express');
const { check  } = require('express-validator');

/**
 *  Los Middlewares
 */
const { 
      validarCampos, 
      tieneRole,
      esAdminRole,
      validarJWT,
      datosCompletos,  
}= require('../middlewares/index')

/**
 *  Los Validadores
 */ 
const  {
        existeBolsaPorId,
        existeBolsaActivaPorId,
}= require('../helpers/db-validators');

/**
 *  Controladores
 */
const {
        obtenerBolsas,
        obtenerBolsa,
        crearBolsa,
        actualizarBolsa,
        eliminarBolsa    
} = require('../controllers/bolsa-trabajos');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerBolsas);

/**
 * Obtener Un Registro
 */
router.get('/:id',[
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeBolsaPorId),
        validarCampos,
], obtenerBolsa);


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
], crearBolsa);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[    
        validarJWT,
        tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
        datosCompletos,    
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeBolsaPorId),
        check('id').custom(existeBolsaActivaPorId),
        check('titulo','El título es obligatorio').not().isEmpty(),
        check('descripcion','La descripciòn es obligatoria').not().isEmpty(),
        check('requisitos','Los requisitos son obligatorios').not().isEmpty(),
        check('enlace','El enlace es obligatorio').not().isEmpty(),
        validarCampos,
], actualizarBolsa);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
        validarJWT,
        tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
        datosCompletos,    
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeBolsaPorId),
        check('id').custom(existeBolsaActivaPorId),
        validarCampos,
], eliminarBolsa);




module.exports = router;

