const {response, request} = require('express');

const {Apoyo}= require('../models/index');


/**
 *  Obtener Todas Los Apoyos
 */
 const obtenerApoyos = async(req=request, res= response)=>{
  const {limite = 5, desde = 0, estado= true, }= req.query;
  const query = {estado};

  const [total, apoyos ]= await Promise.all([
      Apoyo.countDocuments(query),
      Apoyo.find(query)
      .sort({fecha_registro:-1})

                        // .populate('usuario_id',['user_name'])
                        .populate('usuario_id',{password:0, __v:0})
                        .skip( Number( desde ))
                        .limit( Number( limite ) )
  ]);
  res.json({
      total,
      apoyos
  })
    
    
    }

/**
 *  Obtener Un Apoyo
 */
const obtenerApoyo = async(req=request, res= response)=>{
    const {id} = req.params;
    const apoyo = await Apoyo.findById(id)
                                    // .populate('usuario_id',['user_name']);
                .populate('usuario_id',{password:0, __v:0});

    res.json(apoyo)

     
}

/**
 *  Crear Un Apoyo
 */
const crearApoyo = async(req=request, res= response)=>{

    const fecha_registro = Date.now();
    const {titulo, descripcion, requisitos, enlace }= req.body;

    const data = {
        titulo:titulo.toUpperCase().trim(),
        descripcion:descripcion.trim(),
        requisitos:requisitos.trim(),
        enlace:enlace.trim(),
        usuario_id:req.usuario._id,
        fecha_registro
    }
    const apoyo = new Apoyo(data);
    await apoyo.save()
    res.status(200).json(apoyo);


}

/**
 *  Actualizar Un Apoyo
 */
const actualizarApoyo = async(req=request, res= response)=>{

    const {id }= req.params;   
const {titulo, descripcion, requisitos, enlace }= req.body;

const apoyoDB = await  Apoyo.findById(id);

let permiso = true;
(apoyoDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}

const data = {
    titulo:titulo.toUpperCase().trim(),
    descripcion:descripcion.trim(),
    requisitos:requisitos.trim(),
    enlace:enlace.trim(), 
}

const apoyo = await Apoyo.findByIdAndUpdate(id,data, {new:true});
res.json(apoyo);   
}

/**
 *  Eliminar Un Apoyo
 */
const eliminarApoyo = async(req=request, res= response)=>{

    const fecha_eliminacion = Date.now();

const {id} = req.params;
const apoyoDB = await  Apoyo.findById(id);
let permiso = true;
(apoyoDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
const apoyo = await Apoyo.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(apoyo); 
      
}




module.exports={
        obtenerApoyos,
        obtenerApoyo,
        crearApoyo,
        actualizarApoyo,
        eliminarApoyo,
}



