const {response, request} = require('express');


const {InstructorTaller, Taller ,  Instructor, }= require('../models/index');

/**
 *  Obtener Todas Los Instructores - Talleres 
 */
 const obtenerInstructoresTalleres = async(req, res= response)=>{ 
    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, instructoresTalleres] = await Promise.all([
        InstructorTaller.countDocuments(query),
        InstructorTaller.find(query)
                        .populate('taller_id',['titulo'])
                        .populate('instructor_id',['nombre'])
                        .populate('usuario_id',['user_name'])
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        instructoresTalleres
    });    
    }

/**
 *  Obtener Un Instructor - Taller
 */
const obtenerInstructorTaller = async(req, res= response)=>{
    const {id}= req.params;
    const instructortaller = await InstructorTaller.findById(id)
                                                        
                                                        .populate('taller_id',['titulo'])
                                                        .populate('instructor_id',['nombre'])
                                                        .populate('usuario_id',['user_name'])                                        

    res.json(instructortaller);    
}

/** 
 *  Crear Un Instructor - Taller
 */

const crearInstructorTaller = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {taller_id , instructor_id, }= req.body;   

const instructorTallerDB = await InstructorTaller.findOne({taller_id, instructor_id, estado:true});
  if (instructorTallerDB) {
    return res.status(401).json({
        msg: `El instructor: ${instructor_id}, ya se encuentra registrado en el taller${taller_id}- No puede hacer esto`
    }); 
}



    const data = {
        taller_id,
        instructor_id,
        fecha_registro,
        usuario_id: req.usuario._id,
    }
    
                   const instructorTaller = new InstructorTaller(data);
                   await instructorTaller.save();      
    res.status(201).json(instructorTaller);
}

/**
 *  Actualizar Un Instructor - Taller 
 */
const actualizarInstructorTaller = async(req= request, res= response)=>{
  
const {id }= req.params;   
const { taller_id,   instructor_id, }= req.body;



// const noticiaImgDB = await  NoticiaImg.findById(id);
const [instructorTallerDB, instructorTallerDuplicadoDB ] = await Promise.all([
    InstructorTaller.findById(id),
    InstructorTaller.findOne({taller_id, instructor_id, estado:true})
])



let permiso = true;
(instructorTallerDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}

// const noticiaImagenDuplicadaDB = await ConvocatoriaImg.findOne({convocatoria_id, imagen_id, estado:true});


  if (instructorTallerDuplicadoDB && instructorTallerDuplicadoDB._id!=id) {
    return res.status(401).json({
        msg: `El instructor: ${instructor_id}, ya se encuentra registrado en el taller: ${taller_id}- No puede hacer esto`
    }); 
}





const data = {
    taller_id, 
    instructor_id
}

   const instructorTaller = await InstructorTaller.findByIdAndUpdate(id,data, {new:true});
res.json(instructorTaller);    
}

 
/**
 *  Eliminar Un Instructor - Taller
 */
const eliminarInstructorTaller = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const instructorTallerDB = await  InstructorTaller.findById(id);

let permiso = true;
(instructorTallerDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
   const instructorTaller = await InstructorTaller.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(instructorTaller);    
}





const buscarRelacion = async(req, res =response ) => {

    const {id, coleccion}= req.params;
    

    switch (coleccion) {
        case 'talleres':
               buscarInstructoresPorTaller(id, res);
             
            break;
    
        case 'instructores':
               buscarTalleresPorInstructor(id,res);
            break;
    
        default:
           return res.status(500).json({ msg: 'Coloección en desarollo'});
    
            
    } 
    
    // console.log(req.params);
    }
    
    const buscarInstructoresPorTaller=async(id= '', res= response)=>{
    
    const query={estado:true, taller_id:id};
        const [taller,total,instructores]= await Promise.all( [
                Taller.findById(id),
                InstructorTaller.countDocuments(query),
                InstructorTaller.find({estado:true, taller_id:id}, {instructor_id:1,})     
                                    .populate('instructor_id',['nombre'])                                
            ]);
    
            if (!taller || !taller.estado) {
                return  res.status(401).json({
                msg: `El Taller: ${id}, no existe`
                });        
            }
    
        return res.json({
            'Taller': taller.titulo,
            total,
            // results:(carreras) ? [carreras] :[],
            results:instructores,
        });    
    }
    
    const buscarTalleresPorInstructor=async(id= '', res= response)=>{
    
    const query={estado:true, instructor_id:id};
    
        const [instructor,total,talleres]= await Promise.all( [
                Instructor.findById(id),
                InstructorTaller.countDocuments(query),
                InstructorTaller.find({estado:true, instructor_id:id}, {taller_id:1,})     
                                    .populate('taller_id',['titulo'])                                
            ]);
    
            if (!instructor || !instructor.estado) {
                return  res.status(401).json({
                msg: `El instructor ${id}, no existe`
                });        
            }
    
        return res.json({
            'instructor': instructor.nombre,
            total,
            results:talleres,
        });    
    }
    
    
    






module.exports={
        obtenerInstructoresTalleres,
        obtenerInstructorTaller,
        crearInstructorTaller,
        actualizarInstructorTaller,
        eliminarInstructorTaller,
        buscarRelacion
}



