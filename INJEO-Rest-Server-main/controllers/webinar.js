const {response, request} = require('express');

const {Webinar}= require('../models/index');

/**
 *  Obtener Todas los webinars
 */
 const obtenerWebinars = async(req, res= response)=>{ 
    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, webinar] = await Promise.all([
        Webinar.countDocuments(query),
        Webinar.find(query)
        .sort({fecha_registro:-1})

                        .populate('usuario_id',{password:0, __v:0})
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        webinar
    });    
    }

/**
 *  Obtener Un Webinar
 */
const obtenerWebinar = async(req, res= response)=>{
    const {id}= req.params;
    const webinar = await Webinar.findById(id)
                    .populate('usuario_id',{password:0, __v:0});
res.json(webinar);    
}

/** 
 *  Crear Un webinar 
 */
const crearWebinar = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {titulo, enlace }= req.body;   

    const data = {

        titulo:titulo.toUpperCase().trim(),

        enlace:enlace.trim(),
        usuario_id: req.usuario._id,
        fecha_registro
    }
    
    const webinar = new Webinar(data);
await webinar.save();      
    res.status(201).json(webinar);
}

/**
 *  Actualizar Un webinar
 */
const actualizarWebinar = async(req= request, res= response)=>{
  
const {id }= req.params;   
const {titulo,  enlace }= req.body;

const webinarDB = await  Webinar.findById(id);

let permiso = true;
(webinarDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}

const data = {
    titulo:titulo.toUpperCase().trim(),
  
    enlace:enlace.trim(), 
}

const webinar  = await Webinar.findByIdAndUpdate(id,data, {new:true});
res.json(webinar);    
}

/**
 *  Eliminar Un webinar
 */
const eliminarWebinar = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const webinarDB = await  Webinar.findById(id);
let permiso = true;
(webinarDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
const webinar = await Webinar.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(webinar);    
}




module.exports={
        obtenerWebinars,
        obtenerWebinar,
        crearWebinar,
        actualizarWebinar,
        eliminarWebinar,
}



