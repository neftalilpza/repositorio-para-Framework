const {response, request} = require('express');

const {Foro, UsuarioForo}= require('../models/index');
 
/**
 *  Obtener Todos Los Foros
 */
 const obtenerForos = async(req, res= response)=>{

    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, foros] = await Promise.all([
        Foro.countDocuments(query),
        Foro.find(query)
        .sort({fecha_registro:-1})

                        // .populate('usuario_id',['user_name'])
                        .populate('usuario_id',{password:0, __v:0})
                        // .populate('usuario_id',['user_name'])
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);
    res.json({
        total,
        foros
    });

}

/**
 *  Obtener Un Foro
 */
const obtenerForo = async(req, res= response)=>{

    const {id}= req.params;
    const foro = await Foro.findById(id)
    .populate('usuario_id',{password:0, __v:0});

                                        // .populate('usuario_id',['user_name']);
    res.json(foro);    
    
}

/**
 *  Crear Un Foro
 */
const crearForo = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {titulo, descripcion }= req.body;   

    const data = {
        titulo,
        descripcion,
        usuario_id: req.usuario._id,
        fecha_registro
    }    
    const foro = new Foro(data);
    await foro.save();      
    res.status(201).json(foro);
    

}

/**
 *  Actualizar Un Foro
 */
const actualizarForo = async(req, res= response)=>{

    const {id }= req.params;   
    const {titulo, descripcion, }= req.body;

    const foroDB = await  Foro.findById(id);

    let permiso = true;
    (foroDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

    if (!permiso ) {    
        return res.status(401).json({
            msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
        }); 
    }

    const data = {
        titulo,
        descripcion,
    }

    const foro = await Foro.findByIdAndUpdate(id,data, {new:true});

    res.json(foro);    
        
}

/**
 *  Eliminar Un Foro
 */
const eliminarForo = async(req, res= response)=>{

    const fecha_eliminacion = Date.now();
    const {id} = req.params;
    const foroDB = await  Foro.findById(id);
    let permiso = true;
    (foroDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 
    
    if (!permiso ) {    
        return res.status(401).json({
            msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
        }); 
    }
    
const [foro, usuariosForos]= await Promise.all([
    Foro.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true}),
    UsuarioForo.find({
        foro_id:id, estado:true
    }).then( (uF)=>{
            if (uF.length>0) {
                uF.forEach(async (i)=>{
                    await UsuarioForo.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true});
                })
            }
    })
    
    , 
]);

    // const foro = await Foro.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
    
    res.json(foro);    

}




module.exports={
    obtenerForos,
    obtenerForo,
      crearForo,
 actualizarForo,
   eliminarForo,
}



