const { response } = require('express');
const {  Externo, Usuario } = require('../models');


const obtenerExternos = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, externos ] = await Promise.all([
        Externo.countDocuments(query),
        Externo.find(query)
            .populate('usuario_id', 'user_name')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        externos
    });
}

const obtenerExterno = async(req, res = response ) => {

    const { id } = req.params;
    const externo = await Externo.findById( id )
                            .populate('usuario_id', 'user_name');

    res.json( externo );

}

const crearExterno = async(req, res = response ) => {
 // console.log(req.body );
 const fecha_registro = Date.now();
 
 const {  nombre, 
    rfc, direccion, usuario_id,
     

} = req.body;
if(usuario_id==null){
    return res.status(400).json({
        msg:'Usuario Invalido'
    })
}

 /*    const externoDB= await Externo.findOne({rfc, estado:true});

    if (externoDB) {
        return res.status(400).json({
            msg: `¡Lo sentimos! el RFC '${ externoDB.rfc }', ya existe`
        });
    } */

const user_name = `${nombre}`.toUpperCase();
const usuario = await Usuario.findByIdAndUpdate(usuario_id,{user_name, datos_completos:true},{new:true})




const externo = new Externo({ 
    nombre,
    rfc, direccion,  fecha_registro, usuario_id
   });


// // Encriptar la contraseña
/* const salt = bcryptjs.genSaltSync();
usuario.password = bcryptjs.hashSync( password, salt ); */

// // Guardar en BD
await externo.save();
    
res.json({
    externo,

});

}

const actualizarExterno = async( req, res = response ) => {

    const { id } = req.params;
    const { 
         nombre
        ,rfc
        ,direccion
    } = req.body;

    const [externoRegistrado , rfcDB] = await Promise.all([
        Externo.findById(id),
        Externo.findOne({rfc, estado:true})
    ]);

    // console.log(externoRegistrado);

    let permiso = true;
    (externoRegistrado.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 
    
    if (!permiso ) {    
        return res.status(401).json({
            msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
        }); 
    }
  
    if (rfcDB) {
        if (rfcDB._id!=id) {
           return res.status(400).json({
               msg:`El RFC : '${curpDB.rfc}', ya está registrado `.toUpperCase(),
                   
               }); 
        }
    }    

    const externoDB = {    
        nombre
        ,rfc
        ,direccion
    };   

    const externo = await Externo.findByIdAndUpdate( id, externoDB,{new:true});
    res.json(externo);





}


const borrarExterno = async(req, res =response ) => {
    const fecha_eliminacion = Date.now();

    const { id } = req.params;

    const externoRegistrado = await Externo.findById(id);
    let permiso = true;
    (externoRegistrado.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 
    
    if (!permiso ) {    
        return res.status(401).json({
            msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
        }); 
    }




    const externoBorrado = await Externo.findByIdAndUpdate( id, { estado: false, fecha_eliminacion }, {new: true });

    res.json( externoBorrado );
}




module.exports = {
    crearExterno,
    
    borrarExterno,
    actualizarExterno,
    obtenerExterno,
    obtenerExternos
    // obtenerNoticias,
    // obtenerNoticia,
    // actualizarNoticia,
    // borrarNoticia,
}