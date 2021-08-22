const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole , datosCompletos} = require('../middlewares');

const { crearCarrera,
        obtenerCarrera,
        obtenerCarreras,
        actualizarCarrera, 
        borrarCarrera } = require('../controllers/carreras');

const { existeCarreraPorId } = require('../helpers/db-validators');

const router = Router();


//  Obtener todas las categorias - publico
router.get('/', obtenerCarreras );

// Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCarreraPorId ),
    validarCampos,
], obtenerCarrera );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
    
    validarJWT,
    esAdminRole,
    datosCompletos,    

    check('nombre','El nombre es obligatorio').not().isEmpty(),   
    validarCampos
], crearCarrera );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    esAdminRole,
    datosCompletos,
    check('nombre','El nombre es obligatorio').not().isEmpty(),   
    validarCampos
],actualizarCarrera );

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    datosCompletos,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCarreraPorId ),
    validarCampos,
],borrarCarrera);



module.exports = router;