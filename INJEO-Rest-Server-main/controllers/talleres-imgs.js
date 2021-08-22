const {response, request} = require('express');


const {TallerImg, Taller , Image}= require('../models/index');

/**
 *  Obtener Todas Los Talleres Imagenes
 */
 const obtenerTalleresImagenes = async(req, res= response)=>{ 
    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, talleresImgs] = await Promise.all([
        TallerImg.countDocuments(query),
        TallerImg.find(query)
                        .populate('taller_id',['titulo'])
                        .populate('imagen_id',['img'])
                        .populate('usuario_id',['user_name'])
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        talleresImgs
    });    
    }

/**
 *  Obtener Un Taller-Imagen
 */
const obtenerTallerImagen = async(req, res= response)=>{
    const {id}= req.params;
    const tallerImg = await TallerImg.findById(id)
                                                        .populate('taller_id',['titulo'])
                                                        .populate('imagen_id',['img'])
                                                        .populate('usuario_id',['user_name'])                                        

    res.json(tallerImg);    
}

/** 
 *  Crear Un Taller - Imagen
 */
const crearTallerImg = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {taller_id , imagen_id, }= req.body;   

const tallerImageDB = await TallerImg.findOne({taller_id, imagen_id, estado:true});
  if (tallerImageDB) {
    return res.status(401).json({
        msg: `La imagen ${imagen_id} ya se encuentra registrada en el taller${taller_id}- No puede hacer esto`
    }); 
}



    const data = {
        taller_id,
        imagen_id,
        fecha_registro,
        usuario_id: req.usuario._id,
    }
    
                   const tallerImg = new TallerImg(data);
                   await tallerImg.save();      
    res.status(201).json(tallerImg);
}

/**
 *  Actualizar Un Taller - Imagen
 */
const actualizarTallerImg = async(req= request, res= response)=>{
  
const {id }= req.params;   
const { taller_id,   imagen_id, }= req.body;



// const noticiaImgDB = await  NoticiaImg.findById(id);
const [tallerImgDB, tallerImagenDuplicadaDB ] = await Promise.all([
    TallerImg.findById(id),
    TallerImg.findOne({taller_id, imagen_id, estado:true})
])



let permiso = true;
(tallerImgDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}

// const noticiaImagenDuplicadaDB = await ConvocatoriaImg.findOne({convocatoria_id, imagen_id, estado:true});


  if (tallerImagenDuplicadaDB && tallerImagenDuplicadaDB._id!=id) {
    return res.status(401).json({
        msg: `La imagen ${imagen_id} ya se encuentra registrada en el taller: ${taller_id}- No puede hacer esto`
    }); 
}





const data = {
    taller_id, 
    imagen_id
}

   const tallerImage = await TallerImg.findByIdAndUpdate(id,data, {new:true});
res.json(tallerImage);    
}

 
/**
 *  Eliminar Un Taller - Imagen
 */
const eliminarTallerImg = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const tallerImgDB = await  TallerImg.findById(id);

let permiso = true;
(tallerImgDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
   const tallerImage = await TallerImg.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(tallerImage);    
}





const buscarRelacion = async(req, res =response ) => {

    const {id, coleccion}= req.params;
    

    switch (coleccion) {
        case 'talleres':
               buscarImagenesPorTaller(id, res);
            break;
    
        case 'imagenes':
               buscarTalleresPorImagen(id,res);
            break;
    
        default:
           return res.status(500).json({ msg: 'Coloección en desarollo'});
    
            
    } 
    
    // console.log(req.params);
    }
    
    const buscarImagenesPorTaller=async(id= '', res= response)=>{
    
    const query={estado:true, taller_id:id};
        const [taller,total,imagenes]= await Promise.all( [
                Taller.findById(id),
                TallerImg.countDocuments(query),
                TallerImg.find({estado:true, taller_id:id}, {imagen_id:1,})     
                                    .populate('imagen_id',['img'])                                
            ]);
    
            if (!taller || !taller.estado) {
                return   res.status(401).json({
                msg: `El Taller: ${id}, no existe`
                });        
            }
    
        return res.json({
            'Taller': taller.titulo,
            total,
            // results:(carreras) ? [carreras] :[],
            results:imagenes,
        });    
    }
    
    const buscarTalleresPorImagen=async(id= '', res= response)=>{
    
    const query={estado:true, imagen_id:id};
    
        const [imagen,total,talleres]= await Promise.all( [
                Image.findById(id),
                TallerImg.countDocuments(query),
                TallerImg.find({estado:true, imagen_id:id}, {taller_id:1,})     
                                    .populate('taller_id',['titulo'])                                
            ]);
    
            if (!imagen || !imagen.estado) {
                return  res.status(401).json({
                msg: `La imagen ${id}, no existe`
                });        
            }
    
        return res.json({
            'Imagen': imagen._id,
            total,
            results:talleres,
        });    
    }
    
    
    






module.exports={
        obtenerTalleresImagenes,
        obtenerTallerImagen,
          crearTallerImg,
     actualizarTallerImg,
       eliminarTallerImg,
        buscarRelacion
}



