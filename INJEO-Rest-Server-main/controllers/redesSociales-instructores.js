const {response, request} = require('express');


const {RedInstructor,  RedSocial ,  Instructor, }= require('../models/index');

/**
 *  Obtener Todas Las Redes - instructores 
 */
 const obtenerRedesInstructores = async(req, res= response)=>{ 
    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, redesInstructores] = await Promise.all([
        RedInstructor.countDocuments(query),
        RedInstructor.find(query)
                        .populate('red_id',['red'])
                        .populate('instructor_id',['nombre'])
                        .populate('usuario_id',['user_name'])
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
         redesInstructores
    });    
    }

/**
 *  Obtener red-Instructor
 */
const obtenerRedInstructor = async(req, res= response)=>{
    const {id}= req.params;
    const redInstructor = await RedInstructor.findById(id)
                                                        
                                                        .populate('red_id',['red'])
                                                        .populate('instructor_id',['nombre'])
                                                        .populate('usuario_id',['user_name'])                                        

    res.json(redInstructor);    
}

/** 
 *  Crear Un Red - Instructor
 */

const crearRedInstructor = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {red_id , instructor_id, url}= req.body;   

const redInstructorDB = await RedInstructor.findOne({red_id, instructor_id, url, estado:true})
                                                                                            .populate('red_id',['red'])
                                                                                            .populate('instructor_id',['nombre']);
  if (redInstructorDB) {
    //   console.log(redInstructorDB.red_id);
      const{red} = redInstructorDB.red_id;
    return res.status(401).json({
        msg: `El instructor: ${redInstructorDB.instructor_id.nombre}, ya cuenta con la red: ${ red}: ${url} - No puede hacer esto`
    }); 
}



    const data = {
        red_id,
        instructor_id,
        url,
        fecha_registro,
        usuario_id: req.usuario._id,
    }
    
                   const redInstructor = new RedInstructor(data);
                   await redInstructor.save();      
    res.status(201).json(redInstructor);
}

/**
 *  Actualizar Un Instructor - Taller 
 */
const actualizarRedInstructor = async(req= request, res= response)=>{
  
const {id }= req.params;   
const {  red_id,   instructor_id, url }= req.body;

// const noticiaImgDB = await  NoticiaImg.findById(id);
const [redInstructorDB, redInstructorDuplicadoDB ] = await Promise.all([
    RedInstructor.findById(id),
    RedInstructor.findOne({ red_id, instructor_id, url, estado:true})
                                                    .populate('red_id',['red'])
                                                    .populate('instructor_id',['nombre'])
])



let permiso = true;
(redInstructorDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}



if (redInstructorDuplicadoDB && redInstructorDuplicadoDB.instructor_id.equals(redInstructorDB.instructor_id)) {
    
    if (redInstructorDB.red_id== red_id && redInstructorDB.instructor_id==instructor_id && redInstructorDB.url==url ) {
        
    }else{
        return res.status(401).json({
            msg: `instructor: ${redInstructorDuplicadoDB.instructor_id.nombre}, ya cuenta con la red: ${ redInstructorDuplicadoDB.red_id.red}: ${url} - No puede hacer esto`
        })

    }
}
// const noticiaImagenDuplicadaDB = await ConvocatoriaImg.findOne({convocatoria_id, imagen_id, estado:true});

    
    
/*     
  if (redInstructorDuplicadoDB && redInstructorDuplicadoDB._id!=id) {
    //   console.log(redInstructorDuplicadoDB.red_id);
    const{red} = redInstructorDuplicadoDB.red_id;
   
    
    
    return res.status(401).json({
        
        // msg: `El instructor: ${instructor_id}, ya se encuentra registrado en el taller: ${red_id}- No puede hacer esto`
        msg: `El instructor: ${instructor_id}, ya cuenta con la red: ${red}: ${url} - No puede hacer esto`
        
    }); 
}
 */




const data = {
    red_id, 
    instructor_id,
    url
}

   const redInstructor = await RedInstructor.findByIdAndUpdate(id,data, {new:true});
res.json(redInstructor);    
}

 
/**
 *  Eliminar Una red-instructor
 */
const eliminarRedInstructor = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const redInstructorDB = await  RedInstructor.findById(id);

let permiso = true;
(redInstructorDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
   const redInstructor = await RedInstructor.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(redInstructor);    
}





const buscarRelacion = async(req, res =response ) => {

    const {id, coleccion}= req.params;
    

    switch (coleccion) {
        case 'redes':
               buscarInstructoresPorRed(id, res);
             
            break;
    
        case 'instructores':
               buscarRedesPorInstructor(id,res);
            break;
    
        default:
           return res.status(500).json({ msg: 'Coloección en desarollo'});
    
            
    } 
    
    // console.log(req.params);
    }
    
    const buscarInstructoresPorRed=async(id= '', res= response)=>{
    
    const query={estado:true, red_id:id};
        const [red,total,instructores]= await Promise.all( [
                RedSocial.findById(id),
                RedInstructor.countDocuments(query),
                RedInstructor.find({estado:true, red_id:id}, {instructor_id:1,url:1})     
                                    .populate('instructor_id',['nombre'])                                
            ]);
    
            if (!red || !red.estado) {
                return   res.status(401).json({
                msg: `La red: ${id}, no existe`
                });        
            }
    
        return res.json({
            'Red': red.red,
            total,
            // results:(carreras) ? [carreras] :[],
            results:instructores,
        });    
    }
    
    const buscarRedesPorInstructor=async(id= '', res= response)=>{
    
    const query={estado:true, instructor_id:id};
    
        const [instructor,total,redes]= await Promise.all( [
                Instructor.findById(id),
                RedInstructor.countDocuments(query),
                RedInstructor.find({estado:true, instructor_id:id}, {red_id:1, url:1,})     
                                    .populate('red_id',['red'])                                
            ]);
    
            if (!instructor || !instructor.estado) {
               return res.status(401).json({
                msg: `El instructor ${id}, no existe`
                });        
            }
    
        return res.json({
            'instructor': instructor.nombre,
            total,
            results:redes,
        });    
    }
    
    
    






module.exports={
        obtenerRedesInstructores,
        obtenerRedInstructor,
        crearRedInstructor,
        actualizarRedInstructor,
        eliminarRedInstructor,
        buscarRelacion
}



