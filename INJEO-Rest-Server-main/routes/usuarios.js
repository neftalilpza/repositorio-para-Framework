
const { Router } = require('express');
const { check } = require('express-validator');


const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole,
     manipulacionValida,
     
} = require('../middlewares');

const { 
    esRoleValido, 
    emailExiste, 
    existeUsuarioPorId ,
    coleccionesPermitidas,
} = require('../helpers/db-validators');

const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch,
        obtenerUsuario,
        buscarRelacion,
        cambiarPassword
    } = require('../controllers/usuarios');

const router = Router();







router.get('/', usuariosGet );

router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),   
    validarCampos
],obtenerUsuario );






router.put('/:id',[
    validarJWT,
    // esAdminRole,

 


    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    
    check('numero_telefonico', 'El número telefonico es obligatorio').not().isEmpty(),
    check('user_name', 'El user_name es obligatorio').not().isEmpty(),
    // check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    // check('correo').custom( emailExiste ),

    
    
    check('rol').custom( esRoleValido ),
    manipulacionValida,
    
    
    // manipulacionValida,

    validarCampos
],usuariosPut );




router.post('/',[
    // check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    // check('apellido_paterno', 'El apellido paterno es obligatorio').not().isEmpty(),
    // check('apellido_materno', 'El apellido materno es obligatorio').not().isEmpty(),
    // check('edad', 'la edad es obligatoria').not().isEmpty(),
    // check('sexo', 'El sexo es obligatorio').not().isEmpty(),
    // check('curp', 'La CURP  es obligatoria').not().isEmpty(),
    // check('fecha_nacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
    // check('municipio', 'El municipio es obligatorio').not().isEmpty(),
    // check('region', 'La region es obligatoria').not().isEmpty(),
    
    check('numero_telefonico', 'El número telefonico es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( esRoleValido ), 
    validarCampos
], usuariosPost ); 

router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    // tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    manipulacionValida,
    validarCampos
],usuariosDelete );

router.patch('/', usuariosPatch );

router.get('/:coleccion/:id',[
    // validarJWT,
    // check('id','El id debe de ser de mongo ').isMongoId(),
  
    // check('id').custom( existeOfertaPorId ),
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('coleccion').custom(c=> coleccionesPermitidas( c, [    
        'buscar',
        // 'externo'
        
  ] ) ),
     validarCampos,
  ], buscarRelacion); 
  


  
  router.put('/:coleccion/:id',[
    // validarJWT,
    // check('id','El id debe de ser de mongo ').isMongoId(),
  
    // check('id').custom( existeOfertaPorId ),
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),

    check('coleccion').custom(c=> coleccionesPermitidas( c, [    
        'actualizarPassword',
        // 'externo'
        
  ] ) ),
     validarCampos,
  ], cambiarPassword); 
  
  



module.exports = router;