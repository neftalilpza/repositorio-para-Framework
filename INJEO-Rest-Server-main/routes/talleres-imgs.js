
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
  // IMGS
  existeImagePorId,
  existeImageActivaPorId,
  // TALLER-IMG  
  existeTallerImgPorId, 
  existeTallerImgActivaPorId,
  //COLECCIÓNES PERMITIDAS
  coleccionesPermitidas,
  
 }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const {
   obtenerTalleresImagenes,
   obtenerTallerImagen,
     crearTallerImg,
actualizarTallerImg,
  eliminarTallerImg,
  buscarRelacion
  
  
} = require('../controllers/talleres-imgs');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerTalleresImagenes);

/**
 * Obtener Un Registro
 */
router.get('/:id',[  
  check('id','El id es obligatorio').not().isEmpty(),
    check('id','No es un ID válido').isMongoId(),

    // check('id').custom(existeBecaPorId),
    check('id').custom(existeTallerImgPorId),
        validarCampos,
], obtenerTallerImagen);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
  //  esAdminRole,

  check('taller_id','No es un ID válido').isMongoId(),
  check('imagen_id','No es un ID válido').isMongoId(),

  check('taller_id','El campo: taller_id es obligatorio').not().isEmpty(),
  check('imagen_id','El campo: imagen_id es obligatorio').not().isEmpty(),

  check('taller_id').custom(existeTallerPorId),
  check('taller_id').custom(existeTallerActivoPorId),
  
        check('imagen_id').custom(existeImagePorId),
        check('imagen_id').custom(existeImageActivaPorId),


    // check('usuario_id').custom(relacion=>rolesConPrivilegios ( relacion, ['ADMIN_ROLE','USER_ROLE'] ) ),
    validarCampos,
], crearTallerImg);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,   

  check('id','El id es obligatorio').not().isEmpty(),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom(existeTallerImgPorId),
  check('id').custom(existeTallerImgActivaPorId),

    check('taller_id','No es un ID válido').isMongoId(),
    check('imagen_id','No es un ID válido').isMongoId(),
  
    check('taller_id','El campo: taller_id es obligatorio').not().isEmpty(),
    check('imagen_id','El campo: imagen_id es obligatorio').not().isEmpty(),
  
    check('taller_id').custom(existeTallerPorId),
    check('taller_id').custom(existeTallerActivoPorId),
          check('imagen_id').custom(existeImagePorId),
          check('imagen_id').custom(existeImageActivaPorId),
    // check('id').custom(id=>existeModeloPorId(id,'Beca')),

    validarCampos,
], actualizarTallerImg);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,    

  check('id','El id es obligatorio').not().isEmpty(),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom(existeTallerImgPorId),
  check('id').custom(existeTallerImgActivaPorId),

    validarCampos,
], eliminarTallerImg);



router.get('/:coleccion/:id',[
  // validarJWT,
  // check('id','El id debe de ser de mongo ').isMongoId(),

  // check('id').custom( existeOfertaPorId ),
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('coleccion').custom(c=> coleccionesPermitidas( c, [    
      'talleres',
      'imagenes',    
] ) ),
   validarCampos,
], buscarRelacion); 



 
module.exports = router;

