
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
        existeForoPorId,
        existeForoActivoPorId,
}= require('../helpers/db-validators');

/**
 *  Controladores 
 */
const {
        obtenerForo,
        obtenerForos,
        crearForo,
        actualizarForo,
        eliminarForo    
} = require('../controllers/foros');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerForos);

/**
 * Obtener Un Registro
 */
router.get('/:id',[
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeForoPorId),
        validarCampos,    
], obtenerForo);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
        validarJWT,
        tieneRole('ADMIN_ROLE','EXTERNO_ROLE','USER_ROLE'),
        datosCompletos,
        check('titulo','El título es obligatorio').not().isEmpty(),
        check('descripcion','La descripciòn es obligatoria').not().isEmpty(),
        validarCampos,
], crearForo);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[    
        validarJWT,
        tieneRole('ADMIN_ROLE','EXTERNO_ROLE', 'USER_ROLE'),
        datosCompletos,    
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeForoPorId),
        check('id').custom(existeForoActivoPorId),
        check('titulo','El título es obligatorio').not().isEmpty(),
        check('descripcion','La descripciòn es obligatoria').not().isEmpty(),
        validarCampos,
], actualizarForo);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
        validarJWT,
        tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
        datosCompletos,    
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeForoPorId),
        check('id').custom(existeForoActivoPorId),
        validarCampos,
], eliminarForo);





module.exports = router;

