const {response, request} = require('express');

const {Beca}= require('../models/index');

/**
 *  Obtener Todas Las Becas
 */
 const obtenerBecas = async(req, res= response)=>{ 
    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, becas] = await Promise.all([
        Beca.countDocuments(query),
        Beca.find(query)
        .sort({fecha_registro:-1})

                        .populate('usuario_id',{password:0, __v:0})
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        becas
    });    
    }

/**
 *  Obtener Una Beca
 */
const obtenerBeca = async(req, res= response)=>{
    const {id}= req.params;
    const beca = await Beca.findById(id)
                    .populate('usuario_id',{password:0, __v:0});
res.json(beca);    
}

/** 
 *  Crear Una Beca
 */
const crearBeca = async(req, res= response)=>{

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
    
    const beca = new Beca(data);
await beca.save();      
    res.status(201).json(beca);
}

/**
 *  Actualizar Una Beca
 */
const actualizarBeca = async(req= request, res= response)=>{
  
const {id }= req.params;   
const {titulo, descripcion, requisitos, enlace }= req.body;

const becaDB = await  Beca.findById(id);

let permiso = true;
(becaDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

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

const beca = await Beca.findByIdAndUpdate(id,data, {new:true});
res.json(beca);    
}

/**
 *  Eliminar Una Beca
 */
const eliminarBeca = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const becaDB = await  Beca.findById(id);
let permiso = true;
(becaDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
const beca = await Beca.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(beca);    
}




module.exports={
        obtenerBecas,
        obtenerBeca,
        crearBeca,
        actualizarBeca,
        eliminarBeca,
}



