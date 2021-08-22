

const validaCampos = require('../middlewares/validar-campos');
const validarJWT   = require('../middlewares/validar-jwt');
const validaRoles  = require('../middlewares/validar-roles');
const validarArchivo = require('../middlewares/validar-archivo');
const manipulacion = require('../middlewares/manipulacion');
const datosCompletos = require('../middlewares/datos-completos');

module.exports = {
    ...validaCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarArchivo,
    ...manipulacion,
    ...datosCompletos,
}