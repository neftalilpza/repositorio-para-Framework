 
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
            existeRedSocialPorId,
            existeRedSocialActivaPorId,

}= require('../helpers/db-validators');

/**
 *  Controladores 
 */
const {
          obtenerRedesSociales,
          obtenerRedSocial,
          crearRedSocial,
          actualizarRedSocial,
          eliminarRedSocial,

        
           
} = require('../controllers/redes-sociales');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerRedesSociales);

/**
 * Obtener Un Registro
 */
router.get('/:id',[
        validarJWT,

        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeRedSocialPorId),
        validarCampos,    
], obtenerRedSocial);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
        validarJWT,
        tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
        datosCompletos,
        


        check('red','la red es obligatoria').not().isEmpty(),
        // check('descripcion','La descripción es obligatoria').not().isEmpty(),
        // check('descripcion','La descripciòn es obligatoria').not().isEmpty(),
        validarCampos,
], crearRedSocial);


/**
 * Actualizar Un Registro
 */

 router.put('/:id',[    
      
        validarJWT,
        tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
        datosCompletos,
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeRedSocialPorId),
        check('id').custom(existeRedSocialActivaPorId),

        check('red','La red es obligatoria').not().isEmpty(),
        // check('descripcion','La descripción es obligatoria').not().isEmpty(),


        validarCampos,
], actualizarRedSocial);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
        validarJWT,
        tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
        datosCompletos,
        
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeRedSocialPorId),
        check('id').custom(existeRedSocialActivaPorId),

        validarCampos,
], eliminarRedSocial);





module.exports = router;








