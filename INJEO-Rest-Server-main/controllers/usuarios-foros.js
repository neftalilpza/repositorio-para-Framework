const {response, request}= require('express');
const { Foro, Usuario,UsuarioForo}= require('../models/index');


/**
 *  Obtener Todos Usuarios-foros 
 */
 const obtenerUsuariosForos = async(req, res= response)=>{ 
    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, usuariosForos] = await Promise.all([
        UsuarioForo.countDocuments(query),
        UsuarioForo.find(query)
        .sort({fecha_registro:-1})
        .populate('usuario_id', {password:0, __v:0})
        // .populate('foro_id', { __v:0})
        .populate(   [
                {
                    path: 'foro_id',
                    select:{__v:false},
                    populate:{
                        path :'usuario_id',
                        select:{__v:false, password:false}                       
                    }           
            }
            ]
        )   
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        usuariosForos
    });    
    }

/**
 *  Obtener Un Usuario-Foro
 */
const obtenerUsuarioForo = async(req, res= response)=>{
    const {id}= req.params;
    const usuarioForo = await UsuarioForo.findById(id)
    .sort({fecha_registro:-1})
    .populate('usuario_id', {password:0, __v:0})
    // .populate('foro_id', { __v:0});
    .populate(   [
        {
            path: 'foro_id',
            select:{__v:false},
            populate:{
                path :'usuario_id',
                select:{__v:false, password:false}                       
            }           
    }
    ]
) 
    


                                        // .populate('usuario_id',['user_name'])
                                        // .populate('foro_id',['titulo'])
                                        ;
res.json(usuarioForo);    
}

/** 
 *  Crear Un UsuarioForo
 */
const crearUsuarioForo = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {comentario,foro_id, }= req.body;   

    // console.log(comentario);
    const data = {

        comentario,
        foro_id,
        usuario_id: req.usuario._id,
        fecha_registro
    }
    
               const usuarioForo = new UsuarioForo(data);
               await usuarioForo.save();      
res.status(201).json(usuarioForo);
}

/**
 *  Actualizar Un Usuario - foro
 */
const actualizarUsuarioForo = async(req= request, res= response)=>{
  
const {id }= req.params;   
const comentario = req.body.comentario.trim();


const usuarioForoDB = await  UsuarioForo.findById(id);

let permiso = true;
(usuarioForoDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}

// const data = {
//     comentario,
//     // foro_id,
     

// }

   const usuarioForo = await UsuarioForo.findByIdAndUpdate(id,{comentario}, {new:true});
res.json(usuarioForo);    
}

/**
 *  Eliminar Un Usuario-Foro
 */
const eliminarUsuarioForo = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const usuarioForoDB = await  UsuarioForo.findById(id);
let permiso = true;
(usuarioForoDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
   const usuarioForo = await UsuarioForo.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(usuarioForo);    
}




const buscarRelacion = async(req, res =response ) => {

    const {id, coleccion}= req.params;
    

    switch (coleccion) {
        case 'foros':
               buscarUsuariosPorForo(id, res);
             
            break;
    
        case 'usuarios':
               buscarForosPorUsuario(id,res);
            break;
    
        default:
           return res.status(500).json({ msg: 'Coloección en desarollo'});
    
            
    } 
    
    // console.log(req.params);
    }
    
    const buscarUsuariosPorForo=async(id= '', res= response)=>{
    
    const query={estado:true, foro_id:id};
        const [foro,total,usuarios]= await Promise.all( [
                Foro.findById(id),
                UsuarioForo.countDocuments(query),
                UsuarioForo.find({estado:true, foro_id:id}, {usuario_id:1,comentario:1,})     
                                    // .populate('usuario_id',['user_name'])  
                                    .sort({fecha_registro:-1})
                                    .populate('usuario_id',{password:0, __v:0})  
 
                                    
                                    

            ]);
    
            if (!foro || !foro.estado) {
                return  res.status(401).json({
                msg: `El foro: ${id}, no existe`
                });        
            }
    
        return res.json({
            'foro': foro.titulo,
            total,
            // results:(carreras) ? [carreras] :[],
            results:usuarios,
        });    
    }
    
    const buscarForosPorUsuario=async(id= '', res= response)=>{
    
    const query={estado:true, usuario_id:id};
    
        const [usuario, total, foros]= await Promise.all( [
                Usuario.findById(id),
                UsuarioForo.countDocuments(query),
                UsuarioForo.find({estado:true, usuario_id:id}, {foro_id:1,comentario:1,})     
                // .populate('foro_id',['titulo'])                                
                .sort({fecha_registro:-1})
                .populate([{
                    path: 'foro_id',
                    select:{__v:false},
                        populate:{
                            path : 'usuario_id',
                            select:{__v:false, password:false}
                        }
                }])
                                   
                
            ]);
    
            if (!usuario || !usuario.estado) {
               return  res.status(401).json({
                msg: `El usuario ${id}, no existe`
                });        
            }
    
        return res.json({
            'usuario': usuario.user_name,
            total,
            results:foros,
        });    
    }
    
    
    








module.exports={
 obtenerUsuariosForos,
 obtenerUsuarioForo,
 crearUsuarioForo,
 actualizarUsuarioForo,
 eliminarUsuarioForo,
 buscarRelacion
}




