
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
  existeConvocatoriaPorId,
  existeConvocatoriaActivaPorId,
  // IMGS
  existeImagePorId,
  existeImageActivaPorId,
  // CONVOCATORIA-IMG  
  existeConvocatoriaImgPorId, 
  existeConvocatoriaImgActivaPorId,
  coleccionesPermitidas,
  
 }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const {
   obtenerConvocatoriasImagenes,
   obtenerConvocatoriaImagen,
     crearConvocatoriaImg,
actualizarConvocatoriaImg,
  eliminarConvocatoriaImg,
  buscarRelacion
  
  
} = require('../controllers/convocatorias-imgs');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerConvocatoriasImagenes);

/**
 * Obtener Un Registro
 */
router.get('/:id',[  
  check('id','El id es obligatorio').not().isEmpty(),
    check('id','No es un ID válido').isMongoId(),

    // check('id').custom(existeBecaPorId),
    check('id').custom(existeConvocatoriaImgPorId),
        validarCampos,
], obtenerConvocatoriaImagen);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
  //  esAdminRole,

  check('convocatoria_id','No es un ID válido').isMongoId(),
  check('imagen_id','No es un ID válido').isMongoId(),

  check('convocatoria_id','El campo: convocatoria_id es obligatorio').not().isEmpty(),
  check('imagen_id','El campo: imagen_id es obligatorio').not().isEmpty(),

  check('convocatoria_id').custom(existeConvocatoriaPorId),
  check('convocatoria_id').custom(existeConvocatoriaActivaPorId),
  
        check('imagen_id').custom(existeImagePorId),
        check('imagen_id').custom(existeImageActivaPorId),


    // check('usuario_id').custom(relacion=>rolesConPrivilegios ( relacion, ['ADMIN_ROLE','USER_ROLE'] ) ),
    validarCampos,
], crearConvocatoriaImg);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,   

  check('id','El id es obligatorio').not().isEmpty(),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom(existeConvocatoriaImgPorId),
  check('id').custom(existeConvocatoriaImgActivaPorId),

    check('convocatoria_id','No es un ID válido').isMongoId(),
    check('imagen_id','No es un ID válido').isMongoId(),
  
    check('convocatoria_id','El campo: convocatoria_id es obligatorio').not().isEmpty(),
    check('imagen_id','El campo: imagen_id es obligatorio').not().isEmpty(),
  
    check('convocatoria_id').custom(existeConvocatoriaPorId),
    check('convocatoria_id').custom(existeConvocatoriaActivaPorId),
          check('imagen_id').custom(existeImagePorId),
          check('imagen_id').custom(existeImageActivaPorId),
    // check('id').custom(id=>existeModeloPorId(id,'Beca')),

    validarCampos,
], actualizarConvocatoriaImg);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,    

  check('id','El id es obligatorio').not().isEmpty(),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom(existeConvocatoriaImgPorId),
  check('id').custom(existeConvocatoriaImgActivaPorId),

    validarCampos,
], eliminarConvocatoriaImg);



router.get('/:coleccion/:id',[
  // validarJWT,
  // check('id','El id debe de ser de mongo ').isMongoId(),

  // check('id').custom( existeOfertaPorId ),
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('coleccion').custom(c=> coleccionesPermitidas( c, [    
      'convocatorias',
      'imagenes',    
] ) ),
   validarCampos,
], buscarRelacion); 



 
module.exports = router;

