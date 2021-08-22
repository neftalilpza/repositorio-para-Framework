const{ Router } = require('express');
const { check } = require('express-validator');

const { validarCampos , validarArchivoSubir} = require('../middlewares/index');
const {  actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

//Este lo solicits el server de models
const router = Router();


 
// Actualizar una imagen
router.put('/:coleccion/:id',[ //los checks no se ejecutan hasta que se manda  a referenciar validar campos
    validarArchivoSubir,
    
    check('id','El id debe de ser de mongo ').isMongoId(),
    check('coleccion').custom(c=> coleccionesPermitidas( c, [
                        'usuarios', 
                        'noticias',
                        'apoyos',
                        'becas',
                        'bolsas',
                        'carreras',
                        'convocatorias',
                        'escuelas',
                        'talleres',
                        'participantes',
                        'instructores',
                        'redes',
                        'webinars',
    ] ) ),
    validarCampos,
],actualizarImagenCloudinary);
// ],actualizarImagen);

 





module.exports = router;