const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole, tieneRole, datosCompletos } = require('../middlewares');

const { crearTaller,
        obtenerTaller,
        obtenerTalleres,
        actualizarTaller, 
        borrarTaller } = require('../controllers/talleres');
const { existeTallerPorId, existeTallerActivoPorId } = require('../helpers/db-validators');

const router = Router();


//  Obtener todas las categorias - publico
router.get('/', obtenerTalleres );
 
// Obtener una categoria por id - publico
router.get('/:id',[
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeTallerPorId ),
    validarCampos,
], obtenerTaller );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,
    check('titulo','El Titulo es obligatorio').not().isEmpty(),
    check('subtitulo','El subTitulo es obligatorio').not().isEmpty(),
    check('descripcion','La descripción es obligatoria').not().isEmpty(),
    check('enlace','El enlace es obligatorio').not().isEmpty(),
    validarCampos
], crearTaller );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,
    check('titulo','El titulo es obligatorio').not().isEmpty(),
    check('id').custom( existeTallerPorId ),
    validarCampos
],actualizarTaller );

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE','EXTERNO_ROLE'),
    datosCompletos,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeTallerPorId ),
    check('id').custom( existeTallerActivoPorId ),

    validarCampos,
],borrarTaller);



module.exports = router;