const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole ,datosCompletos} = require('../middlewares');

const { crearEscuela,
        obtenerEscuelas,
        obtenerEscuela,
        actualizarEscuela, 
        borrarEscuela } = require('../controllers/escuelas');

const { existeEscuelaPorId } = require('../helpers/db-validators');

const router = Router();


//  Obtener todas las categorias - publico
router.get('/', obtenerEscuelas );

// Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeEscuelaPorId ),
    validarCampos,
], obtenerEscuela );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    esAdminRole,
datosCompletos,
    check('nombre','El nombre es obligatorio').not().isEmpty(),   
    check('enlace','El enlace es obligatorio').not().isEmpty(),   
    validarCampos
], crearEscuela );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    esAdminRole,
    datosCompletos,
    check('nombre','El nombre es obligatorio').not().isEmpty(), 
    check('enlace','El enlace es obligatorio').not().isEmpty(),   

    validarCampos
],actualizarEscuela );

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    datosCompletos,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeEscuelaPorId ),
    validarCampos,
],borrarEscuela);



module.exports = router;