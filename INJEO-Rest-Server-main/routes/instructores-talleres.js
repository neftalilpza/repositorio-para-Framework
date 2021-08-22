
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
  // Taller
    existeTallerPorId,
    existeTallerActivoPorId,
  // Instructor
   existeInstructorPorId,
   existeInstructorActivoPorId,
  // TALLER-IMG  
   existeInstructorTallerPorId, 
   existeInstructorTallerActivoPorId,
  //COLECCIÓNES PERMITIDAS
  coleccionesPermitidas,
  
 }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const {
    obtenerInstructoresTalleres,
    obtenerInstructorTaller,
    crearInstructorTaller,
    actualizarInstructorTaller,
    eliminarInstructorTaller,
  
    buscarRelacion
  
  
} = require('../controllers/instructores-talleres');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerInstructoresTalleres);

/**
 * Obtener Un Registro
 */
router.get('/:id',[  
  check('id','El id es obligatorio').not().isEmpty(),
    check('id','No es un ID válido').isMongoId(),

    // check('id').custom(existeBecaPorId),
    check('id').custom(existeInstructorTallerPorId),
        validarCampos,
], obtenerInstructorTaller);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
  //  esAdminRole,

  check('taller_id','No es un ID válido').isMongoId(),
  check('instructor_id','No es un ID válido').isMongoId(),

  check('taller_id','El campo: taller_id es obligatorio').not().isEmpty(),
  check('instructor_id','El campo: instructor_id es obligatorio').not().isEmpty(),

  check('taller_id').custom(existeTallerPorId),
  check('taller_id').custom(existeTallerActivoPorId),
  
        check('instructor_id').custom(existeInstructorPorId),
        check('instructor_id').custom(existeInstructorActivoPorId),


    // check('usuario_id').custom(relacion=>rolesConPrivilegios ( relacion, ['ADMIN_ROLE','USER_ROLE'] ) ),
    validarCampos,
], crearInstructorTaller);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,   

  check('id','El id es obligatorio').not().isEmpty(),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom(existeInstructorTallerPorId),
  check('id').custom(existeInstructorTallerActivoPorId),

    check('taller_id','No es un ID válido').isMongoId(),
    check('instructor_id','No es un ID válido').isMongoId(),
  
    check('taller_id','El campo: taller_id es obligatorio').not().isEmpty(),
    check('instructor_id','El campo: instructor_id es obligatorio').not().isEmpty(),
  
    check('taller_id').custom(existeTallerPorId),
    check('taller_id').custom(existeTallerActivoPorId),
          check('instructor_id').custom(existeInstructorPorId),
          check('instructor_id').custom(existeInstructorActivoPorId),
    // check('id').custom(id=>existeModeloPorId(id,'Beca')),

    validarCampos,
], actualizarInstructorTaller);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,    

  check('id','El id es obligatorio').not().isEmpty(),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom(existeInstructorTallerPorId),
  check('id').custom(existeInstructorTallerActivoPorId),

    validarCampos,
], eliminarInstructorTaller);



router.get('/:coleccion/:id',[
  // validarJWT,
  // check('id','El id debe de ser de mongo ').isMongoId(),

  // check('id').custom( existeOfertaPorId ),
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('coleccion').custom(c=> coleccionesPermitidas( c, [    
      'talleres',
      'instructores',    
] ) ),
   validarCampos,
], buscarRelacion); 



 
module.exports = router;

