
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
           existeInstructorPorId,
           existeInstructorActivoPorId,

}= require('../helpers/db-validators');

/**
 *  Controladores 
 */
const {
          obtenerInstructores,
          obtenerInstructor,
          crearInstructor,
          actualizarInstructor,
          eliminarInstructor,

        
           
} = require('../controllers/instructores');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerInstructores);

/**
 * Obtener Un Registro
 */
router.get('/:id',[
        validarJWT,

        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeInstructorPorId),
        validarCampos,    
], obtenerInstructor);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
        validarJWT,
        tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
        datosCompletos,
        


        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('descripcion','La descripción es obligatoria').not().isEmpty(),
        // check('descripcion','La descripciòn es obligatoria').not().isEmpty(),
        validarCampos,
], crearInstructor);


/**
 * Actualizar Un Registro
 */

 router.put('/:id',[    
      
        validarJWT,
        tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
        datosCompletos,
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeInstructorPorId),
        check('id').custom(existeInstructorActivoPorId),

        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('descripcion','La descripción es obligatoria').not().isEmpty(),


        validarCampos,
], actualizarInstructor);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
        validarJWT,
        tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
        datosCompletos,
        
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeInstructorPorId),
        check('id').custom(existeInstructorActivoPorId),

        validarCampos,
], eliminarInstructor);





module.exports = router;








