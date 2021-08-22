
const { Router } = require('express');
const { check } = require('express-validator');


const {
    validarCampos,
    validarJWT,
    tieneRole,
    // esAdminRole,
    // tieneRole
} = require('../middlewares');


const { 
    crearExterno, borrarExterno, actualizarExterno,  obtenerExterno,obtenerExternos
    } = require('../controllers/externos');
const {
    existeUsuarioPorId, 
    existeExternoPorId, 
    existeRelacion , 
    existeUsuarioActivoPorId, 
    existeRelacionConUsuario,
    rfcExiste,
} = require('../helpers/index');

const router = Router();







router.get('/', obtenerExternos );

router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeExternoPorId ),   
    validarCampos
],obtenerExterno );






router.put('/:id',[
    validarJWT,
    tieneRole('EXTERNO_ROLE','ADMIN_ROLE'),


    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeExternoPorId ),

    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('direccion', 'La dirección es obligatoria').not().isEmpty(),
    // check('numero_telefonico', 'El número telefonico es obligatorio').not().isEmpty(),
    check('rfc', 'El RFC  es obligatorio').not().isEmpty(),

    
    // check('id').custom( existeUsuarioPorId ),
    // check('rol').custom( esRoleValido ), 
    validarCampos
],actualizarExterno );
 




router.post('/',[
    validarJWT,
    tieneRole('EXTERNO_ROLE','ADMIN_ROLE'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('direccion', 'La dirección es obligatoria').not().isEmpty(),
    // check('numero_telefonico', 'El número telefonico es obligatorio').not().isEmpty(),
    check('rfc', 'El RFC  es obligatorio').not().isEmpty(),
    check('rfc').custom( rfcExiste),
    // check('correo', 'El correo no es válido').isEmail(),
    // check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    // check('rol', 'El rol es obligatorio').not().isEmpty(),
// 
    // check('correo').custom( existeEmailExterno),
    // check('correo').custom( emailExiste),

    check('usuario_id', 'El usuario_id es obligatorio').not().isEmpty(),
    
    check('usuario_id', 'No es un ID válido').isMongoId(),
    check('usuario_id').custom( existeUsuarioPorId ),    
    check('usuario_id').custom( existeUsuarioActivoPorId ),

    check('usuario_id').custom( existeRelacionConUsuario ),    
    check('usuario_id').custom(relacion=>existeRelacion ( relacion, ['EXTERNO_ROLE'] ) ),
    validarCampos

], crearExterno);




 router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    // tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeExternoPorId ),
    validarCampos
],borrarExterno );
 


// router.patch('/', usuariosPatch );





module.exports = router;