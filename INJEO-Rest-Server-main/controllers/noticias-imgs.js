const {response, request} = require('express');


const {NoticiaImg, Noticia , Image}= require('../models/index');

/**
 *  Obtener Todas Las Noticias Imagenes
 */
 const obtenerNoticiasImagenes = async(req, res= response)=>{ 
    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, noticiasImgs] = await Promise.all([
        NoticiaImg.countDocuments(query),
        NoticiaImg.find(query)
                        .populate('noticia_id',['titulo'])
                        .populate('imagen_id',['img'])
                        .populate('usuario_id',['user_name'])
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);


    res.json({
        total,
        noticiasImgs
    });    
    }

/**
 *  Obtener Una Noticia-Imagen
 */
const obtenerNoticiaImagen = async(req, res= response)=>{
    const {id}= req.params;
    const noticiaImg = await NoticiaImg.findById(id)
                                                        .populate('noticia_id',['titulo'])
                                                        .populate('imagen_id',['img'])
                                                        .populate('usuario_id',['user_name'])                                        

    res.json(noticiaImg);    
}

/** 
 *  Crear Una Noticia Imagen
 */
const crearNoticiaImg = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {noticia_id , imagen_id, }= req.body;   

const noticiaImageDB = await NoticiaImg.findOne({noticia_id, imagen_id, estado:true});
  if (noticiaImageDB) {
    return res.status(401).json({
        msg: `La imagen ${imagen_id} ya se encuentra registrada en la noticia ${noticia_id}- No puede hacer esto`
    }); 
}



    const data = {
        noticia_id,
        imagen_id,
        fecha_registro,
        usuario_id: req.usuario._id,
    }
    
                   const noticiaImg = new NoticiaImg(data);
                   await noticiaImg.save();      
    res.status(201).json(noticiaImg);
}

/**
 *  Actualizar Una Noticia Imagen
 */
const actualizarNoticiaImg = async(req= request, res= response)=>{
  
const {id }= req.params;   
const { noticia_id,   imagen_id, }= req.body;



// const noticiaImgDB = await  NoticiaImg.findById(id);
const [noticiaImgDB, noticiaImagenDuplicadaDB ] = await Promise.all([
    NoticiaImg.findById(id),
    NoticiaImg.findOne({noticia_id, imagen_id, estado:true})
])



let permiso = true;
(noticiaImgDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}

// const noticiaImagenDuplicadaDB = await ConvocatoriaImg.findOne({convocatoria_id, imagen_id, estado:true});


  if (noticiaImagenDuplicadaDB && noticiaImagenDuplicadaDB._id!=id) {
    return res.status(401).json({
        msg: `La imagen ${imagen_id} ya se encuentra registrada en la noticia: ${noticia_id}- No puede hacer esto`
    }); 
}





const data = {
    noticia_id, 
    imagen_id
}

   const noticiaImage = await NoticiaImg.findByIdAndUpdate(id,data, {new:true});
res.json(noticiaImage);    
}

 
/**
 *  Eliminar Una Convocatoria Imagen
 */
const eliminarNoticiaImg = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const noticiaImgDB = await  NoticiaImg.findById(id);

let permiso = true;
(noticiaImgDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
   const noticiaImage = await NoticiaImg.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
res.json(noticiaImage);    
}





const buscarRelacion = async(req, res =response ) => {

    const {id, coleccion}= req.params;
    

    switch (coleccion) {
        case 'noticias':
               buscarImagenesPorNoticia(id, res);
            break;
    
        case 'imagenes':
               buscarNoticiasPorImagen(id,res);
            break;
    
        default:
           return res.status(500).json({ msg: 'Coloección en desarollo'});
    
            
    } 
    
    // console.log(req.params);
    }
        
    const buscarImagenesPorNoticia=async(id= '', res= response)=>{
    
    const query={estado:true, noticia_id:id};
        const [noticia,total,imagenes]= await Promise.all( [
                Noticia.findById(id),
                NoticiaImg.countDocuments(query),
                NoticiaImg.find({estado:true, noticia_id:id}, {imagen_id:1,})  
                                    .sort({fecha_registro:-1})
                                            // .populate('imagen_id',{usuario}) 
                                    .populate(
                                        [
                                            {
                                                path: 'imagen_id',
                                                select:{__v:false},
                                                populate:{
                                                    path :'usuario_id',
                                                    select:{__v:false, password:false}
                                                   
                                                }
                                              

                                            

                                        //     {
                                        //         path: 'usuario_id',
                                        //         slect:'password'
                                        //         // populate: [{
                                        //         //     path: 'benefits'
                                        //         // }, {
                                        //         //     path: 'eligibility', 
                                        //         //     model: 'Eligibility'
                                        //         // }]
                                        // }





                                        }
                                        ]
                                    )                              
            ]);
    
            if (!noticia || !noticia.estado) {
                return     res.status(401).json({
                msg: `La noticia ${id}, no existe`
                });        
            }
    
        return res.json({
            'Noticia': noticia.titulo,
            total,
            // results:(carreras) ? [carreras] :[],
            results:imagenes,
        });    
    }
    
    const buscarNoticiasPorImagen=async(id= '', res= response)=>{
    
    const query={estado:true, imagen_id:id};
    
        const [imagen,total,noticias]= await Promise.all( [
                Image.findById(id),
                NoticiaImg.countDocuments(query),
                NoticiaImg.find({estado:true, imagen_id:id}, {noticia_id:1,})     
                                    .populate('noticia_id',['titulo'])                                
            ]);
    
            if (!imagen || !imagen.estado) {
                return  res.status(401).json({
                msg: `La imagen ${id}, no existe`
                });        
            }
    
        return res.json({
            'Imagen': imagen._id,
            total,
            results:noticias,
        });    
    }
    
    
    






module.exports={
        obtenerNoticiasImagenes,
        obtenerNoticiaImagen,
          crearNoticiaImg,
     actualizarNoticiaImg,
       eliminarNoticiaImg,
        buscarRelacion
}



