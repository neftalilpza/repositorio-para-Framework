const {response, request} = require('express');


const {RedParticipante,  RedSocial ,  Participante, }= require('../models/index');

/**
 *  Obtener Todas 
 */
 const obtenerRedesParticipantes = async(req, res= response)=>{ 
    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, redesParticipantes] = await Promise.all([
        RedParticipante.countDocuments(query),
        RedParticipante.find(query)
                        .populate('red_id',['red'])
                        .populate('participante_id',['nombre'])
                        .populate('usuario_id',['user_name'])
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
         redesParticipantes
    });    
    }

/**
 *  Obtener 
 */
const obtenerRedParticipante = async(req, res= response)=>{
    const {id}= req.params;
    const redParticipante = await RedParticipante.findById(id)
                                                        
                                                        .populate('red_id',['red'])
                                                        .populate('participante_id',['nombre'])
                                                        .populate('usuario_id',['user_name'])                                        

    res.json(redParticipante);    
}

/** 
 *  Crear
 */

const crearRedParticipante = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {red_id , participante_id, url}= req.body;   

const redParticipanteDB = await RedParticipante.findOne({red_id, participante_id, url, estado:true}).populate('red_id',['red']).populate('participante_id',['nombre']);
  if (redParticipanteDB) {
    //   console.log(redInstructorDB.red_id);
      const{red} = redParticipanteDB.red_id;
      const{nombre} = redParticipanteDB.participante_id;
    return res.status(401).json({
        msg: `El participante: ${nombre}, ya cuenta con la red: ${ red}: ${url} - No puede hacer esto`
    }); 
}



    const data = {
        red_id,
        participante_id,
        url,
        fecha_registro,
        usuario_id: req.usuario._id,
    }
    
                   const redParticipante = new RedParticipante(data);
                   await redParticipante.save();      
    res.status(201).json(redParticipante);
}

/**
 *  Actualizar
 */
const actualizarRedParticipante = async(req= request, res= response)=>{
  
const {id }= req.params;   
const {  red_id,   participante_id, url }= req.body;

// const noticiaImgDB = await  NoticiaImg.findById(id);
const [redInstructorDB, redParticipanteDuplicadoDB ] = await Promise.all([
    RedParticipante.findById(id),
    RedParticipante.findOne({ red_id, participante_id, url, estado:true}).populate('red_id',['red']).populate('participante_id',['nombre'])
])


let permiso = true;
(redInstructorDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
        
    }); 
}
    

// console.log(redParticipanteDuplicadoDB.participante_id);
// console.log(redInstructorDB.participante_id);
if (redParticipanteDuplicadoDB && redParticipanteDuplicadoDB.participante_id.equals(redInstructorDB.participante_id) ) {
 
    if (redInstructorDB.red_id==red_id && redInstructorDB.participante_id==participante_id && redInstructorDB.url==url ) {
    // console.log('Es el mismo valir');
    
    }else{
        // console.log(`El Instructor ${redParticipanteDuplicadoDB.participante_id}, ya cuenta con la red social`);
        return res.status(401).json({
            msg: `El participante: ${redParticipanteDuplicadoDB.participante_id.nombre}, ya cuenta con la red: ${ redParticipanteDuplicadoDB.red_id.red}: ${url} - No puede hacer esto`
        })

    }   
}


/* if (redInstructorDB && redParticipanteDuplicadoDB._id===id) {

if (redParticipanteDuplicadoDB.red_id==red_id && redParticipanteDuplicadoDB.participante_id == participante_id  && redParticipanteDuplicadoDB.url == url) {
    console.log('Es lo mismo no pasa Nada');

    } else{
    console.log('Este participante ya tien esa red');
}
} */



const data = {
    red_id, 
    participante_id,
    url
}


   const redParticipante = await RedParticipante.findByIdAndUpdate(id,data, {new:true});
res.json(redParticipante);    
}

 
/**
 *  Eliminar 
 */
const eliminarRedParticipante = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const redParticipanteDB = await  RedParticipante.findById(id);

let permiso = true;
(redParticipanteDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
   const redParticipante = await RedParticipante.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(redParticipante);    
}





const buscarRelacion = async(req, res =response ) => {

    const {id, coleccion}= req.params;
    

    switch (coleccion) {
        case 'redes':
               buscarParticipantesPorRed(id, res);
             
            break;
    
        case 'participantes':
               buscarRedesPorParticipante(id,res);
            break;
    
        default:
           return res.status(500).json({ msg: 'Coloección en desarollo'});
    
            
    } 
    
    // console.log(req.params);
    }
    
    const buscarParticipantesPorRed=async(id= '', res= response)=>{
    
    const query={estado:true, red_id:id};
        const [red,total,participantes]= await Promise.all( [
                RedSocial.findById(id),
                RedParticipante.countDocuments(query),
                RedParticipante.find({estado:true, red_id:id}, {participante_id:1,url:1,})     
                                    .populate('participante_id',['nombre'])                                
            ]);
    
            if (!red || !red.estado) {
                return res.status(401).json({
                msg: `La red: ${id}, no existe`
                });        
            }
    
        return res.json({
            'Red': red.red,
            total,
            // results:(carreras) ? [carreras] :[],
            results:participantes,
        });    
    }
    
    const buscarRedesPorParticipante=async(id= '', res= response)=>{
    
    const query={estado:true, participante_id:id};
    
        const [participante,total,redes]= await Promise.all( [
                Participante.findById(id),
                RedParticipante.countDocuments(query),
                RedParticipante.find({estado:true, participante_id:id}, {red_id:1,url:1})     
                .sort({fecha_registro:-1})
                                    
                // .populate('red_id',['red','img'])     
                .populate([{
                    path: 'red_id',
                   select:{__v:false},
                        populate:{
                            path:'usuario_id',
                            select:{__v:false, password:false}
                            
                        }
                }])                           
            ]);
    
            if (!participante || !participante.estado) {
                return res.status(401).json({
                msg: `El participante ${id}, no existe`
                });        
            }
    
        return res.json({
            'participante': participante.nombre,
            total,
            results:redes,
        });    
    }
    
    
    






module.exports={
        obtenerRedesParticipantes,
        obtenerRedParticipante,
        crearRedParticipante,
        actualizarRedParticipante,
        eliminarRedParticipante,
        buscarRelacion
}



