const {response, request} = require('express');
 
const {BolsaTrabajo}= require('../models/index');

/**
 *  Obtener Todas Las Bolsa De Trabajo
 */
 const obtenerBolsas = async(req, res= response)=>{
 
    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, bolsas] = await Promise.all([
        BolsaTrabajo.countDocuments(query),
        BolsaTrabajo.find(query)
                        .sort({fecha_registro:-1})
                        // .populate('usuario_id',['user_name'])
                        .populate('usuario_id',{password:0, __v:0})
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        bolsas
    });

    }

/**
 *  Obtener Una Bolsa De Trabajo
 */
const obtenerBolsa = async(req, res= response)=>{
    const {id}= req.params;
    const bolsaTrabajo = await BolsaTrabajo.findById(id)
                                        // .populate('usuario_id',['user_name']);
                                        .populate('usuario_id',{password:0, __v:0})

res.json(bolsaTrabajo);   
}

/**
 *  Crear Una Bolsa de Trabajo
 */
const crearBolsa = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {titulo, descripcion, requisitos, enlace }= req.body;   

    const data = {

        titulo:titulo.toUpperCase().trim(),
        descripcion:descripcion.trim(),
        requisitos:requisitos.trim(),
        enlace:enlace.trim(),
        usuario_id: req.usuario._id,
        fecha_registro
    }
    
    const bolsaTrabajo = new BolsaTrabajo(data);
await bolsaTrabajo.save();      
    res.status(201).json(bolsaTrabajo);    
}

/**
 *  Actualizar Una Bolsa de Trabajo
 */
const actualizarBolsa = async(req, res= response)=>{

    const {id }= req.params;   
const {titulo, descripcion, requisitos, enlace }= req.body;

const bolsaTrabajoDB = await  BolsaTrabajo.findById(id);

let permiso = true;
(bolsaTrabajoDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}

const data = {
    titulo:titulo.toUpperCase(),
    descripcion:descripcion.trim(),
    requisitos:requisitos.trim(),
    enlace:enlace.trim(), 
}

const bolsaTrabajo = await BolsaTrabajo.findByIdAndUpdate(id,data, {new:true});
res.json(bolsaTrabajo);   
}

/**
 *  Eliminar Una Bolsa de Trabajo
 */
const eliminarBolsa = async(req, res= response)=>{

    const fecha_eliminacion = Date.now();

const {id} = req.params;
const bolsaTrabajoDB = await  BolsaTrabajo.findById(id);
let permiso = true;
(bolsaTrabajoDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
const bolsaTrabajo = await BolsaTrabajo.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(bolsaTrabajo); 
    
}




module.exports={
    obtenerBolsa,
    obtenerBolsas,
    crearBolsa,
    actualizarBolsa,
    eliminarBolsa,
}



