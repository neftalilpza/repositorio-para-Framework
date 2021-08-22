
const { Router } = require('express');
const { check } = require('express-validator');

/**
 *  Los Middlewares
 */
const { 
    validarCampos, 
    tieneRole, 
    esAdminRole, 
    validarJWT, 
    datosCompletos
  }= require('../middlewares/index')

/**
 *  Los Validadores
 */

const  {
    existeWebinarPorId, 
    existeWebinarActivoPorId
 }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const {
   obtenerWebinars,
   obtenerWebinar,
     crearWebinar,
actualizarWebinar,
  eliminarWebinar    
} = require('../controllers/webinar');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerWebinars);

/**
 * Obtener Un Registro
 */
router.get('/:id',[  
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeWebinarPorId),
        validarCampos,
], obtenerWebinar);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
   check('titulo','El título es obligatorio').not().isEmpty(),
   check('enlace','El enlace es obligatorio').not().isEmpty(),   
    validarCampos,
], crearWebinar);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,    
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeWebinarPorId),
    check('id').custom(existeWebinarActivoPorId),
    // check('id').custom(id=>existeModeloPorId(id,'Beca')),
    check('titulo','El título es obligatorio').not().isEmpty(),
    check('enlace','El enlace es obligatorio').not().isEmpty(),
    validarCampos,
], actualizarWebinar);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,    
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeWebinarPorId),
    check('id').custom(existeWebinarActivoPorId),
    validarCampos,
], eliminarWebinar);





module.exports = router;

