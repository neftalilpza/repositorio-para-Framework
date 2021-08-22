const {response, request} = require('express');


const {ConvocatoriaImg, Convocatoria, Image}= require('../models/index');

/**
 *  Obtener Todas Las Convocatorias Imagenes
 */
 const obtenerConvocatoriasImagenes = async(req, res= response)=>{ 
    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, convocatoriasImgs] = await Promise.all([
        ConvocatoriaImg.countDocuments(query),
        ConvocatoriaImg.find(query)
                        .populate('convocatoria_id',['titulo'])
                        .populate('imagen_id',['img'])
                        .populate('usuario_id',['user_name'])
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        convocatoriasImgs
    });    
    }

/**
 *  Obtener Una Convocatoria-Imagen
 */
const obtenerConvocatoriaImagen = async(req, res= response)=>{
    const {id}= req.params;
    const convocatoriaImg = await ConvocatoriaImg.findById(id)
                                                        .populate('convocatoria_id',['titulo'])
                                                        .populate('imagen_id',['img'])
                                                        .populate('usuario_id',['user_name'])                                        

    res.json(convocatoriaImg);    
}

/** 
 *  Crear Una Convocatoria Imagen
 */
const crearConvocatoriaImg = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {convocatoria_id , imagen_id, }= req.body;   

const convocatoriaImageDB = await ConvocatoriaImg.findOne({convocatoria_id, imagen_id, estado:true});
if (convocatoriaImageDB) {
    return res.status(401).json({
        msg: `La imagen ${imagen_id} ya se encuentra registrada en la convocatoria ${convocatoria_id}- No puede hacer esto`
    }); 
}



    const data = {
        convocatoria_id,
        imagen_id,
        fecha_registro,
        usuario_id: req.usuario._id,
    }
    
                   const convocatoriaImg = new ConvocatoriaImg(data);
                   await convocatoriaImg.save();      
    res.status(201).json(convocatoriaImg);
}

/**
 *  Actualizar Una Convocatoria Imagen
 */
const actualizarConvocatoriaImg = async(req= request, res= response)=>{
  
const {id }= req.params;   
const { convocatoria_id,   imagen_id, }= req.body;

// const convocatoriaImgDB = await  ConvocatoriaImg.findById(id);

const [convocatoriaImgDB, convocatoriaDuplicadaImageDB]= await Promise.all([
    ConvocatoriaImg.findById(id),
    ConvocatoriaImg.findOne({convocatoria_id, imagen_id, estado:true})
]);

let permiso = true;
(convocatoriaImgDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}

// const convocatoriaDuplicadaImageDB = await ConvocatoriaImg.findOne({convocatoria_id, imagen_id, estado:true});
  if (convocatoriaDuplicadaImageDB && convocatoriaDuplicadaImageDB._id!=id) {
    return res.status(401).json({
        msg: `La imagen ${imagen_id} ya se encuentra registrada en la convocatoria ${convocatoria_id}- No puede hacer esto`
    }); 
}





const data = {
    convocatoria_id, 
    imagen_id
}

   const convocatoriaImage = await ConvocatoriaImg.findByIdAndUpdate(id,data, {new:true});
res.json(convocatoriaImage);    
}

 
/**
 *  Eliminar Una Convocatoria Imagen
 */
const eliminarConvocatoriaImg = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const convocatoriaImgDB = await  ConvocatoriaImg.findById(id);
let permiso = true;
(convocatoriaImgDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
   const convocatoriaImage = await ConvocatoriaImg.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(convocatoriaImage);    
}





const buscarRelacion = async(req, res =response ) => {

    const {id, coleccion}= req.params;
    

    switch (coleccion) {
        case 'convocatorias':
               buscarImagenesPorConvocatoria(id, res);
            break;
    
        case 'imagenes':
               buscarConvocatoriasPorImagen(id,res);
            break;
    
        default:
           return res.status(500).json({ msg: 'Coloección en desarollo'});
    
            
    } 
    
    // console.log(req.params);
    }
    
    const buscarImagenesPorConvocatoria=async(id= '', res= response)=>{
    
    const query={estado:true, convocatoria_id:id};
        const [convocatoria,total,imagenes]= await Promise.all( [
                Convocatoria.findById(id),
                ConvocatoriaImg.countDocuments(query),
                // Oferta.find({estado:true, escuela:id}, {carrera:1, _id:0})
                ConvocatoriaImg.find({estado:true, convocatoria_id:id}, {imagen_id:1,})     
                                    .populate('imagen_id',['img'])                                
            ]);
    
            if (!convocatoria || !convocatoria.estado) {
                return   res.status(401).json({
                msg: `La convocatoria ${id}, no existe`
                });        
            }
    
        return res.json({
            'Convocatoria': convocatoria.titulo,
            total,
            // results:(carreras) ? [carreras] :[],
            results:imagenes,
        });    
    }
    
    const buscarConvocatoriasPorImagen=async(id= '', res= response)=>{
    
    const query={estado:true, imagen_id:id};
    
        const [imagen,total,convocatorias]= await Promise.all( [
                Image.findById(id),
                ConvocatoriaImg.countDocuments(query),
                // Oferta.find({estado:true, escuela:id}, {carrera:1, _id:0})
                ConvocatoriaImg.find({estado:true, imagen_id:id}, {convocatoria_id:1,})     
                                    .populate('convocatoria_id',['titulo'])                                
            ]);
    
            if (!imagen || !imagen.estado) {
                return  res.status(401).json({
                msg: `La imagen ${id}, no existe`
                });        
            }
    
        return res.json({
            'Imagen': imagen._id,
            total,
            // results:(escuelas) ? [escuelas] :[],
            results:convocatorias,
        });    
    }
    
    
    






module.exports={
        obtenerConvocatoriasImagenes,
        obtenerConvocatoriaImagen,
        crearConvocatoriaImg,
        actualizarConvocatoriaImg,
        eliminarConvocatoriaImg,
        buscarRelacion
}



