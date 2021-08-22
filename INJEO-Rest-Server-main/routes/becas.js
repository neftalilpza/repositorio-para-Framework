
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
  existeBecaPorId, 
  existeBecaActivaPorId
 }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const {
   obtenerBecas,
   obtenerBeca,
     crearBeca,
actualizarBeca,
  eliminarBeca    
} = require('../controllers/becas');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerBecas);

/**
 * Obtener Un Registro
 */
router.get('/:id',[  
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeBecaPorId),
        validarCampos,
], obtenerBeca);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
  //  esAdminRole,
   check('titulo','El título es obligatorio').not().isEmpty(),
   check('descripcion','La descripciòn es obligatoria').not().isEmpty(),
   check('requisitos','Los requisitos son obligatorios').not().isEmpty(),
   check('enlace','El enlace es obligatorio').not().isEmpty(),   
    // check('usuario_id').custom(relacion=>rolesConPrivilegios ( relacion, ['ADMIN_ROLE','USER_ROLE'] ) ),
    validarCampos,
], crearBeca);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,    
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeBecaPorId),
    check('id').custom(existeBecaActivaPorId),
    // check('id').custom(id=>existeModeloPorId(id,'Beca')),
    check('titulo','El título es obligatorio').not().isEmpty(),
    check('descripcion','La descripciòn es obligatoria').not().isEmpty(),
    check('requisitos','Los requisitos son obligatorios').not().isEmpty(),
    check('enlace','El enlace es obligatorio').not().isEmpty(),
    validarCampos,
], actualizarBeca);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,    
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeBecaPorId),
    check('id').custom(existeBecaActivaPorId),
    validarCampos,
], eliminarBeca);





module.exports = router;

