
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
        validarArchivoSubir,
        datosCompletos
}= require('../middlewares/index')

/**
 *  Los Validadores
 */
const  {
        existeImagePorId,
         existeImageActivaPorId,
}= require('../helpers/db-validators');

/**
 *  Controladores 
 */
const {
        obtenerImages,
        obtenerImage,
        crearImage,
        actualizarImage,
        eliminarImage,

        
           
} = require('../controllers/images');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerImages);

/**
 * Obtener Un Registro
 */
router.get('/:id',[
        validarJWT,

        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeImagePorId),
        validarCampos,    
], obtenerImage);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
        validarJWT,
        tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
        datosCompletos,
        
    validarArchivoSubir,

        // check('titulo','El título es obligatorio').not().isEmpty(),
        // check('descripcion','La descripciòn es obligatoria').not().isEmpty(),
        validarCampos,
], crearImage);


/**
 * Actualizar Un Registro
 */

 router.put('/:id',[    
      
        validarJWT,
        tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
        datosCompletos,
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeImagePorId),
        check('id').custom(existeImageActivaPorId),
    validarArchivoSubir,

        validarCampos,
], actualizarImage);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
        validarJWT,
        tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
        datosCompletos,
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeImagePorId),
        check('id').custom(existeImageActivaPorId),

        validarCampos,
], eliminarImage);





module.exports = router;

