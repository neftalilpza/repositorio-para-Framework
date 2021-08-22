
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
  // Foro
    existeForoPorId,
    existeForoActivoPorId,
  // Usuario
    existeUsuarioPorId,
    existeUsuarioActivoPorId,
  // TALLER-IMG  
    existeUsuarioForoPorId, 
    existeUsuarioForoActivoPorId,
  //COLECCIÓNES PERMITIDAS
  coleccionesPermitidas,
  
 }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const {
    obtenerUsuariosForos,
    obtenerUsuarioForo,
    crearUsuarioForo,
    actualizarUsuarioForo,
    eliminarUsuarioForo,
  
    buscarRelacion
  
  
} = require('../controllers/usuarios-foros');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerUsuariosForos);

/**
 * Obtener Un Registro
 */
router.get('/:id',[  
  check('id','El id es obligatorio').not().isEmpty(),
    check('id','No es un ID válido').isMongoId(),
    // check('comentario','El comentario es obligatorio').not().isEmpty(),

    // check('id').custom(existeBecaPorId),
    check('id').custom(existeUsuarioForoPorId),
        validarCampos,
], obtenerUsuarioForo);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
    // tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
  //  esAdminRole,

  check('foro_id','No es un ID válido').isMongoId(),
  

  check('foro_id','El campo: foro_id es obligatorio').not().isEmpty(),
  

  check('foro_id').custom(existeForoPorId),
  check('foro_id').custom(existeForoActivoPorId),
  
  check('comentario','El comentario es obligatorio').not().isEmpty(),
  
  


    // check('usuario_id').custom(relacion=>rolesConPrivilegios ( relacion, ['ADMIN_ROLE','USER_ROLE'] ) ),
    validarCampos,
], crearUsuarioForo);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    validarJWT,
    // tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,   

  check('id','El id es obligatorio').not().isEmpty(),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom(existeUsuarioForoPorId),
  check('id').custom(existeUsuarioForoActivoPorId),

    // check('foro_id','No es un ID válido').isMongoId(),  
    // check('foro_id','El campo: foro_id es obligatorio').not().isEmpty(),
    // check('foro_id').custom(existeForoPorId),
    // check('foro_id').custom(existeForoActivoPorId),
    // check('id').custom(id=>existeModeloPorId(id,'Beca')),
    check('comentario','El comentario es obligatorio').not().isEmpty(),

    validarCampos,
], actualizarUsuarioForo);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
//   tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,    

  check('id','El id es obligatorio').not().isEmpty(),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom(existeUsuarioForoPorId),
  check('id').custom(existeUsuarioForoActivoPorId),

    validarCampos,
], eliminarUsuarioForo);



router.get('/:coleccion/:id',[
  // validarJWT,
  // check('id','El id debe de ser de mongo ').isMongoId(),

  // check('id').custom( existeOfertaPorId ),
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('coleccion').custom(c=> coleccionesPermitidas( c, [    
      'foros',
      'usuarios',    
] ) ),
   validarCampos,
], buscarRelacion); 



 
module.exports = router;

