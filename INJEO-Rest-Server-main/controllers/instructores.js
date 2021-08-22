const {response, request} = require('express');

const { Instructor, RedInstructor, InstructorTaller}= require('../models/index');

/**
 *  Obtener Todos Los Instructores
 */
 const obtenerInstructores = async(req, res= response)=>{ 
    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, instructores] = await Promise.all([
        Instructor.countDocuments(query),
        Instructor.find(query)
                        .populate('usuario_id',['user_name'])
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        instructores
    });    
    }

/**
 *  Obtener Un Instructor
 */
const obtenerInstructor = async(req, res= response)=>{
    const {id}= req.params;
    const instructor = await Instructor.findById(id)
                                        .populate('usuario_id',['user_name']);
 res.json(instructor);    
}

/** 
 *  Crear Un Instructor
 */
const crearInstructor = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {nombre,descripcion, }= req.body;   

    const data = {

        nombre:nombre.toUpperCase(),
        descripcion,
        usuario_id: req.usuario._id,
        fecha_registro
    }
    
               const instructor = new Instructor(data);
               await instructor.save();      
res.status(201).json(instructor);
}

/**
 *  Actualizar Un Instructor
 */
const actualizarInstructor = async(req= request, res= response)=>{
  
const {id }= req.params;   
const {nombre,descripcion, }= req.body;

const instructorDB = await  Instructor.findById(id);

let permiso = true;
(instructorDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}

const data = {
    nombre:nombre.toUpperCase(),
    descripcion,

}

   const instructor = await Instructor.findByIdAndUpdate(id,data, {new:true});
res.json(instructor);    
}

/**
 *  Eliminar Un Istructor
 */
const eliminarInstructor = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const instructorDB = await  Instructor.findById(id);
let permiso = true;
(instructorDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}

//    const instructor = await Instructor.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
const [instructor, redInstructor, instructorTaller] = await Promise.all([
/**
 * 
 */
Instructor.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true}),
/**
 * 
 */
RedInstructor.find({ instructor_id:id, estado:true}).then( (rI)=>{
    if (rI.length>0) {
        rI.forEach( async(i)=>{
            await RedInstructor.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true})
        })
    }
}),
/**
 * 
 */
InstructorTaller.find({instructor_id:id, estado:true}).then( (iT)=>{
    if (iT.length>0) {
        iT.forEach( async(i)=>{
          await  InstructorTaller.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true})
        })
    }
})


])



res.json(instructor);    
}




module.exports={
            obtenerInstructores,
            obtenerInstructor,
            crearInstructor,
            actualizarInstructor,
            eliminarInstructor,
}



