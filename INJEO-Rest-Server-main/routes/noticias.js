const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole , datosCompletos} = require('../middlewares');

const { crearNoticia,
        obtenerNoticia,
        obtenerNoticias,
        actualizarNoticia, 
        borrarNoticia } = require('../controllers/noticias');
const { existeNoticiaPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', obtenerNoticias );

// Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeNoticiaPorId ),
    validarCampos,
], obtenerNoticia );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    esAdminRole,
    datosCompletos,

    check('titulo','El Titulo es obligatorio').not().isEmpty(),
    check('subtitulo','El subTitulo es obligatorio').not().isEmpty(),
    check('descripcion','La descripción es obligatoria').not().isEmpty(),
    validarCampos
], crearNoticia );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    esAdminRole,
    datosCompletos,
    check('titulo','El titulo es obligatorio').not().isEmpty(),
    check('id').custom( existeNoticiaPorId ),
    validarCampos
],actualizarNoticia );

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    datosCompletos,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeNoticiaPorId ),
    validarCampos,
],borrarNoticia);



module.exports = router;