
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
          existeParticipantePorId,
          existeParticipanteActivoPorId,

}= require('../helpers/db-validators');

/**
 *  Controladores 
 */
const {
         obtenerParticipantes,
         obtenerParticipante,
         crearParticipante,
         actualizarParticipante,
         eliminarParticipante,

        
           
} = require('../controllers/participantes');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerParticipantes);

/**
 * Obtener Un Registro
 */
router.get('/:id',[
        validarJWT,

        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeParticipantePorId),
        validarCampos,    
], obtenerParticipante);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
        validarJWT,
        tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
        datosCompletos,
        


        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('descripcion','La descripción es obligatoria').not().isEmpty(),
        check('cargo','el cargo es obligatoria').not().isEmpty(),
        // check('descripcion','La descripciòn es obligatoria').not().isEmpty(),
        validarCampos,
], crearParticipante);


/**
 * Actualizar Un Registro
 */

 router.put('/:id',[    
      
        validarJWT,
        tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
        datosCompletos,
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeParticipantePorId),
        check('id').custom(existeParticipanteActivoPorId),

        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('descripcion','La descripción es obligatoria').not().isEmpty(),
        check('cargo','el cargo es obligatoria').not().isEmpty(),


        validarCampos,
], actualizarParticipante);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
        validarJWT,
        tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
        datosCompletos,
        
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeParticipantePorId),
        check('id').custom(existeParticipanteActivoPorId),

        validarCampos,
], eliminarParticipante);





module.exports = router;








