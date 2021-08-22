
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
  // Noticias
     existeNoticiaPorId,
     existeNoticiaActivaPorId,
  // Participantes
    existeParticipantePorId,
    existeParticipanteActivoPorId,
  // Participantes - Noticias
    existeParticipanteNoticiaPorId, 
    existeParticipanteNoticiaActivaPorId,
  //COLECCIÓNES PERMITIDAS
  coleccionesPermitidas,
  
 }= require('../helpers/db-validators');

/**
 *  Controladores
 */

const {
    obtenerParticipantesNoticias,
    obtenerParticipanteNoticia,
    crearParticipanteNoticia,
    actualizarParticipanteNoticia,
    eliminarParticipanteNoticia,
  
    buscarRelacion
  
  
} = require('../controllers/participantes-noticias');


const router = new Router();

/**
 *  Obtener Todos Los Registros 
 */
router.get('/',obtenerParticipantesNoticias);

/**
 * Obtener Un Registro
 */
router.get('/:id',[  
  check('id','El id es obligatorio').not().isEmpty(),
    check('id','No es un ID válido').isMongoId(),

    // check('id').custom(existeBecaPorId),
    check('id').custom(existeParticipanteNoticiaPorId),
        validarCampos,
], obtenerParticipanteNoticia);


/**
 *  Crear Y Guardar Un Registro
 */
 router.post('/',[
   validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
   datosCompletos,
  //  esAdminRole,

  check('noticia_id','No es un ID válido').isMongoId(),
  check('participante_id','No es un ID válido').isMongoId(),

  check('noticia_id','El campo: noticia_id es obligatorio').not().isEmpty(),
  check('participante_id','El campo: participante_id es obligatorio').not().isEmpty(),

  check('noticia_id').custom(existeNoticiaPorId),
  check('noticia_id').custom(existeNoticiaActivaPorId),
  
        check('participante_id').custom(existeParticipantePorId),
        check('participante_id').custom(existeParticipanteActivoPorId),


    // check('usuario_id').custom(relacion=>rolesConPrivilegios ( relacion, ['ADMIN_ROLE','USER_ROLE'] ) ),
    validarCampos,
], crearParticipanteNoticia);


/**
 * Actualizar Un Registro
 */
 router.put('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,   

  check('id','El id es obligatorio').not().isEmpty(),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom(existeParticipanteNoticiaPorId),
  check('id').custom(existeParticipanteNoticiaActivaPorId),

    check('noticia_id','No es un ID válido').isMongoId(),
    check('participante_id','No es un ID válido').isMongoId(),
  
    check('noticia_id','El campo: noticia_id es obligatorio').not().isEmpty(),
    check('participante_id','El campo: participante_id es obligatorio').not().isEmpty(),
  
    check('noticia_id').custom(existeNoticiaPorId),
    check('noticia_id').custom(existeNoticiaActivaPorId),
          check('participante_id').custom(existeParticipantePorId),
          check('participante_id').custom(existeParticipanteActivoPorId),
    // check('id').custom(id=>existeModeloPorId(id,'Beca')),

    validarCampos,
], actualizarParticipanteNoticia);

/**
 * Eliminar Un Registro
 */
router.delete('/:id',[
  validarJWT,
  tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
  datosCompletos,    

  check('id','El id es obligatorio').not().isEmpty(),
  check('id','No es un ID válido').isMongoId(),
  check('id').custom(existeParticipanteNoticiaPorId),
  check('id').custom(existeParticipanteNoticiaActivaPorId),

    validarCampos,
], eliminarParticipanteNoticia);



router.get('/:coleccion/:id',[
  // validarJWT,
  // check('id','El id debe de ser de mongo ').isMongoId(),

  // check('id').custom( existeOfertaPorId ),
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('coleccion').custom(c=> coleccionesPermitidas( c, [    
      'noticias',
      'participantes',    
] ) ),
   validarCampos,
], buscarRelacion); 



 
module.exports = router;

