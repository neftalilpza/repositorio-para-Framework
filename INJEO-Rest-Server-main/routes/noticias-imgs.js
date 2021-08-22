
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
  // CONVOCATORIA
   existeNoticiaPorId,
   existeNoticiaActivaPorId,
  // IMGS
  existeImagePorId,
  existeImageActivaPorId,
  // CONVOCATORIA-IMG  
 existeNoticiaImgPorId, 
 existeNoticiaImgActivaPorId,
  //COLECCIÓNES PERMITIDAS
  coleccionesPermitidas,
  
 }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const {
   obtenerNoticiasImagenes,
   obtenerNoticiaImagen,
     crearNoticiaImg,
actualizarNoticiaImg,
  eliminarNoticiaImg,
  buscarRelacion
  
  
} = require('../controllers/noticias-imgs');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerNoticiasImagenes);

/**
 * Obtener Un Registro
 */
router.get('/:id',[  
  check('id','El id es obligatorio').not().isEmpty(),
    check('id','No es un ID válido').isMongoId(),

    // check('id').custom(existeBecaPorId),
    check('id').custom(existeNoticiaImgPorId),
        validarCampos,
], obtenerNoticiaImagen);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
  //  esAdminRole,

  check('noticia_id','No es un ID válido').isMongoId(),
  check('imagen_id','No es un ID válido').isMongoId(),

  check('noticia_id','El campo: noticia_id es obligatorio').not().isEmpty(),
  check('imagen_id','El campo: imagen_id es obligatorio').not().isEmpty(),

  check('noticia_id').custom(existeNoticiaPorId),
  check('noticia_id').custom(existeNoticiaActivaPorId),
  
        check('imagen_id').custom(existeImagePorId),
        check('imagen_id').custom(existeImageActivaPorId),


    // check('usuario_id').custom(relacion=>rolesConPrivilegios ( relacion, ['ADMIN_ROLE','USER_ROLE'] ) ),
    validarCampos,
], crearNoticiaImg);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,   

  check('id','El id es obligatorio').not().isEmpty(),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom(existeNoticiaImgPorId),
  check('id').custom(existeNoticiaImgActivaPorId),

    check('noticia_id','No es un ID válido').isMongoId(),
    check('imagen_id','No es un ID válido').isMongoId(),
  
    check('noticia_id','El campo: noticia_id es obligatorio').not().isEmpty(),
    check('imagen_id','El campo: imagen_id es obligatorio').not().isEmpty(),
  
    check('noticia_id').custom(existeNoticiaPorId),
    check('noticia_id').custom(existeNoticiaActivaPorId),
          check('imagen_id').custom(existeImagePorId),
          check('imagen_id').custom(existeImageActivaPorId),
    // check('id').custom(id=>existeModeloPorId(id,'Beca')),

    validarCampos,
], actualizarNoticiaImg);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,    

  check('id','El id es obligatorio').not().isEmpty(),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom(existeNoticiaImgPorId),
  check('id').custom(existeNoticiaImgActivaPorId),

    validarCampos,
], eliminarNoticiaImg);



router.get('/:coleccion/:id',[
  // validarJWT,
  // check('id','El id debe de ser de mongo ').isMongoId(),

  // check('id').custom( existeOfertaPorId ),
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('coleccion').custom(c=> coleccionesPermitidas( c, [    
      'noticias',
      'imagenes',    
] ) ),
   validarCampos,
], buscarRelacion); 



 
module.exports = router;

