 

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
  // Red
  
    existeRedSocialPorId,
    existeRedSocialActivaPorId,
  // Participante
   existeParticipantePorId,
   existeParticipanteActivoPorId,
  // Red - Participante  
    existeRedParticipantePorId, 
    existeRedParticipanteActivoPorId,
  //COLECCIÓNES PERMITIDAS
  coleccionesPermitidas,
  
 }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const {
    obtenerRedesParticipantes,
    obtenerRedParticipante,
    crearRedParticipante,
    actualizarRedParticipante,
    eliminarRedParticipante,
  
    buscarRelacion
  
  
} = require('../controllers/redesSociales-Participantes');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerRedesParticipantes);

/**
 * Obtener Un Registro
 */
router.get('/:id',[  
  check('id','El id es obligatorio').not().isEmpty(),
    check('id','No es un ID válido').isMongoId(),

    // check('id').custom(existeBecaPorId),
    check('id').custom(existeRedParticipantePorId),
        validarCampos,
], obtenerRedParticipante);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
  //  esAdminRole,

  
  
  check('red_id','No es un ID válido').isMongoId(),
  check('participante_id','No es un ID válido').isMongoId(),

  check('url','la url es obligatoria').not().isEmpty(),



  check('red_id','El campo: red_id es obligatorio').not().isEmpty(),
  check('participante_id','El campo: participante_id es obligatorio').not().isEmpty(),

  check('red_id').custom(existeRedSocialPorId),
  check('red_id').custom(existeRedSocialActivaPorId),
  
        check('participante_id').custom(existeParticipantePorId),
        check('participante_id').custom(existeParticipanteActivoPorId),


    // check('usuario_id').custom(relacion=>rolesConPrivilegios ( relacion, ['ADMIN_ROLE','USER_ROLE'] ) ),
    validarCampos,
], crearRedParticipante);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,   

  check('id','El id es obligatorio').not().isEmpty(),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom(existeRedParticipantePorId),
  check('id').custom(existeRedParticipanteActivoPorId),

  check('url','la url es obligatoria').not().isEmpty(),

    check('red_id','No es un ID válido').isMongoId(),
    check('participante_id','No es un ID válido').isMongoId(),
  
    check('red_id','El campo: red_id es obligatorio').not().isEmpty(),
    check('participante_id','El campo: participante_id es obligatorio').not().isEmpty(),
  
    check('red_id').custom(existeRedSocialPorId),
    check('red_id').custom(existeRedSocialActivaPorId),
          check('participante_id').custom(existeParticipantePorId),
          check('participante_id').custom(existeParticipanteActivoPorId),
    // check('id').custom(id=>existeModeloPorId(id,'Beca')),

    validarCampos,
], actualizarRedParticipante);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,    

  check('id','El id es obligatorio').not().isEmpty(),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom(existeRedParticipantePorId),
  check('id').custom(existeRedParticipanteActivoPorId),

    validarCampos,
], eliminarRedParticipante);



router.get('/:coleccion/:id',[
  // validarJWT,
  // check('id','El id debe de ser de mongo ').isMongoId(),

  // check('id').custom( existeOfertaPorId ),
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('coleccion').custom(c=> coleccionesPermitidas( c, [    
      'redes',
      'participantes',    
] ) ),
   validarCampos,
], buscarRelacion); 



 
module.exports = router;


