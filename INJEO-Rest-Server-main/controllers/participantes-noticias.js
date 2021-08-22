const {response, request} = require('express');


const {ParticipanteNoticia, Noticia ,   Participante, }= require('../models/index');

/**
 *  Obtener Todas Los Participantes - Noticias 
 */
 const obtenerParticipantesNoticias = async(req, res= response)=>{ 
    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, participantesNoticias] = await Promise.all([
        ParticipanteNoticia.countDocuments(query),
        ParticipanteNoticia.find(query)
                        .populate('noticia_id',['titulo'])
                        .populate('participante_id',['nombre'])
                        .populate('usuario_id',['user_name'])
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        participantesNoticias
    });    
    }

/**
 *  Obtener Un Participante - Noticia
 */
const obtenerParticipanteNoticia = async(req, res= response)=>{
    const {id}= req.params;
    const participanteNoticia = await ParticipanteNoticia.findById(id)
                                                        
                                                        .populate('noticia_id',['titulo'])
                                                        .populate('participante_id',['nombre'])
                                                        .populate('usuario_id',['user_name'])                                        

    res.json(participanteNoticia);    
}

/** 
 *  Crear Un Participante - Noticia
 */

const crearParticipanteNoticia = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {noticia_id ,  participante_id, }= req.body;   

const participanteNoticiaDB = await ParticipanteNoticia.findOne({ noticia_id,  participante_id, estado:true});
  if (participanteNoticiaDB) {
    return res.status(401).json({
        msg: `El participante: ${participante_id}, ya se encuentra registrado en la noticia ${noticia_id}- No puede hacer esto`
    }); 
}



    const data = {
         noticia_id,
         participante_id,
        fecha_registro,
        usuario_id: req.usuario._id,
    }
    
                   const participanteNoticia = new ParticipanteNoticia(data);
                   await participanteNoticia.save();      
    res.status(201).json(participanteNoticia);
}

/**
 *  Actualizar Un Participante - Noticia
 */
const actualizarParticipanteNoticia = async(req= request, res= response)=>{
  
const {id }= req.params;   
const { noticia_id,   participante_id, }= req.body;



// const noticiaImgDB = await  NoticiaImg.findById(id);
const [participanteNoticiaDB, participanteNoticiaDuplicadaDB ] = await Promise.all([
    ParticipanteNoticia.findById(id),
    ParticipanteNoticia.findOne({ noticia_id, participante_id, estado:true})
])



let permiso = true;
(participanteNoticiaDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}

// const noticiaImagenDuplicadaDB = await ConvocatoriaImg.findOne({convocatoria_id, imagen_id, estado:true});


  if (participanteNoticiaDuplicadaDB && participanteNoticiaDuplicadaDB._id!=id) {
    return res.status(401).json({
        msg: `El participante: ${participante_id}, ya se encuentra registrado en la noticia: ${noticia_id}- No puede hacer esto`
    }); 
}





const data = {
     noticia_id, 
     participante_id
}

   const participanteNoticia = await ParticipanteNoticia.findByIdAndUpdate(id,data, {new:true});
res.json(participanteNoticia);    
}

 
/**
 *  Eliminar Un Participante - Noticia

 */
const eliminarParticipanteNoticia = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const participanteNoticiaDB = await  ParticipanteNoticia.findById(id);

let permiso = true;
(participanteNoticiaDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
   const participanteNoticia = await ParticipanteNoticia.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(participanteNoticia);    
}





const buscarRelacion = async(req, res =response ) => {

    const {id, coleccion}= req.params;
    

    switch (coleccion) {
        case 'noticias':
               buscarParticipantesPorNoticia(id, res);
             
            break;
    
        case 'participantes':
               buscarNoticiasPorParticipante(id,res);
            break;
    
        default:
           return res.status(500).json({ msg: 'Coloección en desarollo'});
    
            
    } 
    
    // console.log(req.params);
    }
    
    const buscarParticipantesPorNoticia=async(id= '', res= response)=>{
    
    const query={estado:true, noticia_id:id};
        const [noticia,total,participantes]= await Promise.all( [
                Noticia.findById(id),
                ParticipanteNoticia.countDocuments(query),
                ParticipanteNoticia.find({estado:true, noticia_id:id}, {participante_id:1,})     
                                    // .populate('participante_id',['nombre', 'img','descripcion','cargo'])                                
           
                    .sort({fecha_registro:-1})
                    .populate([{
                        path: 'participante_id',
                        select:{__v:false},
                            populate:{
                                path : 'usuario_id',
                                select:{__v:false, password:false}
                            }
                    }])
                                ]);
    
            if (!noticia || !noticia.estado) {
                return    res.status(401).json({
                msg: `La noticia: ${id}, no existe`
                });        
            }
    
        return res.json({
            'noticia': noticia.titulo,
            total,
            // results:(carreras) ? [carreras] :[],
            results:participantes,
        });    
    }
    
    const buscarNoticiasPorParticipante=async(id= '', res= response)=>{
    
    const query={estado:true, participante_id:id};
    
        const [participante, total, noticias]= await Promise.all( [
                Participante.findById(id),
                ParticipanteNoticia.countDocuments(query),
                ParticipanteNoticia.find({estado:true, participante_id:id}, {noticia_id:1,})     
                                    .populate('noticia_id',['titulo'])                                
            ]);
    
            if (!participante || !participante.estado) {
                return  res.status(401).json({
                msg: `El participante ${id}, no existe`
                });        
            }
    
        return res.json({
            'participante': participante.nombre,
            total,
            results:noticias,
        });    
    }
    
    
    






module.exports={
        obtenerParticipantesNoticias,
        obtenerParticipanteNoticia,
        crearParticipanteNoticia,
        actualizarParticipanteNoticia,
        eliminarParticipanteNoticia,
        buscarRelacion
}



