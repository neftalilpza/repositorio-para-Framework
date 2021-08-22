
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
  // Red
  
    existeRedSocialPorId,
    existeRedSocialActivaPorId,
  // Instructor
   existeInstructorPorId,
   existeInstructorActivoPorId,
  // Red - Instructor  
    existeRedInstructorPorId, 
    existeRedInstructorActivoPorId,
  //COLECCIÓNES PERMITIDAS
  coleccionesPermitidas,
  
 }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const {
    obtenerRedesInstructores,
    obtenerRedInstructor,
    crearRedInstructor,
    actualizarRedInstructor,
    eliminarRedInstructor,
  
    buscarRelacion
  
  
} = require('../controllers/redesSociales-instructores');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerRedesInstructores);

/**
 * Obtener Un Registro
 */
router.get('/:id',[  
  check('id','El id es obligatorio').not().isEmpty(),
    check('id','No es un ID válido').isMongoId(),

    // check('id').custom(existeBecaPorId),
    check('id').custom(existeRedInstructorPorId),
        validarCampos,
], obtenerRedInstructor);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
  //  esAdminRole,

  
  
  check('red_id','No es un ID válido').isMongoId(),
  check('instructor_id','No es un ID válido').isMongoId(),

  check('url','la url es obligatoria').not().isEmpty(),



  check('red_id','El campo: red_id es obligatorio').not().isEmpty(),
  check('instructor_id','El campo: instructor_id es obligatorio').not().isEmpty(),

  check('red_id').custom(existeRedSocialPorId),
  check('red_id').custom(existeRedSocialActivaPorId),
  
        check('instructor_id').custom(existeInstructorPorId),
        check('instructor_id').custom(existeInstructorActivoPorId),


    // check('usuario_id').custom(relacion=>rolesConPrivilegios ( relacion, ['ADMIN_ROLE','USER_ROLE'] ) ),
    validarCampos,
], crearRedInstructor);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,   

  check('id','El id es obligatorio').not().isEmpty(),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom(existeRedInstructorPorId),
  check('id').custom(existeRedInstructorActivoPorId),

  check('url','la url es obligatoria').not().isEmpty(),

    check('red_id','No es un ID válido').isMongoId(),
    check('instructor_id','No es un ID válido').isMongoId(),
  
    check('red_id','El campo: red_id es obligatorio').not().isEmpty(),
    check('instructor_id','El campo: instructor_id es obligatorio').not().isEmpty(),
  
    check('red_id').custom(existeRedSocialPorId),
    check('red_id').custom(existeRedSocialActivaPorId),
          check('instructor_id').custom(existeInstructorPorId),
          check('instructor_id').custom(existeInstructorActivoPorId),
    // check('id').custom(id=>existeModeloPorId(id,'Beca')),

    validarCampos,
], actualizarRedInstructor);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,    

  check('id','El id es obligatorio').not().isEmpty(),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom(existeRedInstructorPorId),
  check('id').custom(existeRedInstructorActivoPorId),

    validarCampos,
], eliminarRedInstructor);



router.get('/:coleccion/:id',[
  // validarJWT,
  // check('id','El id debe de ser de mongo ').isMongoId(),

  // check('id').custom( existeOfertaPorId ),
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('coleccion').custom(c=> coleccionesPermitidas( c, [    
      'redes',
      'instructores',    
] ) ),
   validarCampos,
], buscarRelacion); 



 
module.exports = router;

