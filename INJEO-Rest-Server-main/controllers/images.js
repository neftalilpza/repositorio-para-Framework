const {response, request} = require('express');

//back end  autirizado por cloudinary
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const {Image, ConvocatoriaImg, TallerImg, NoticiaImg}= require('../models/index');
 
/**
 *  Obtener Todas las imagenes
 */
 const obtenerImages = async(req, res= response)=>{

    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, images] = await Promise.all([
        Image.countDocuments(query),
        Image.find(query)
        .sort({fecha_registro:-1})
        .populate('usuario_id', {password:0, __v:0})
                        .skip(Number( desde ) )
                        .limit(Number( limite) )
    ]);
    res.json({
        total,
        images
    });
}

/**
 *  Obtener Una imagen
 */
const obtenerImage = async(req, res= response)=>{

    const {id}= req.params;
    const foro = await Image.findById(id)
                                        .populate('usuario_id',['user_name']);
    res.json(foro);    
    
}

/**
 *  Crear Una Image
 */
const crearImage = async(req, res= response)=>{
    const fecha_registro = Date.now(); 
    const { tempFilePath }= req.files.archivo;
    const { secure_url} = await cloudinary.uploader.upload(tempFilePath);
    const img = secure_url;
    // await modelo.save();
        // res.json(img);  
    const data ={
        img,
        fecha_registro,
        usuario_id: req.usuario._id,
    }
    const image = new Image(data)
    await image.save();
        res.status(201).json(image) 
}


/**
 *  Crear Una Image
 */
const actualizarImage = async(req, res= response)=>{


    const {id }= req.params;   


    const imageDB = await  Image.findById(id);

    let permiso = true;
    (imageDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

    if (!permiso ) {    
        return res.status(401).json({
            msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
        }); 
    }



  




/*     const fecha_registro = Date.now(); 
    const { tempFilePath }= req.files.archivo;
    const { secure_url} = await cloudinary.uploader.upload(tempFilePath);
    const img = secure_url;
    // await modelo.save();
        // res.json(img);  
    const data ={
        img,
        fecha_registro,
        usuario_id: req.usuario._id,
    }
    const image = new Image(data)
    await image.save();
        res.status(201).json(image)  */
        if (imageDB.img) {
            const nombreArr = imageDB.img.split('/');///El arreglo del nombre del archivo
            const nombre = nombreArr[ nombreArr.length -1 ];//para obtener el ultimo, es decir el puro noombre
            const [ public_id ]= nombre.split('.');//Desestructurar el nombre, y obtener el puro nombre 
            cloudinary.uploader.destroy(public_id);//Este es para remplazar la imagen
          
          }
          
        
          const { tempFilePath }= req.files.archivo;
          const { secure_url} = await cloudinary.uploader.upload(tempFilePath);
          imageDB.img = secure_url;
            await imageDB.save();  
            res.json(imageDB);
            
/*             
    const data = {
        titulo,
        descripcion,
    }

    const foro = await Foro.findByIdAndUpdate(id,data, {new:true});
    res.json(foro);   */
            
}



/**
 *  Eliminar Un Foro
 */
const eliminarImage = async(req, res= response)=>{

    const fecha_eliminacion = Date.now();
    const {id} = req.params; 

    const imageDB = await  Image.findById(id);
    let permiso = true;
    (imageDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 
    
    if (!permiso ) {    
        return res.status(401).json({
            msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
        }); 
    }
    
    const [convocatoriaImg, noticiaImg, tallerImg,image] = await Promise.all([
            // Eliminar Todos los registros de convocatoriaImg que tienen el id de la img
            ConvocatoriaImg.find({imagen_id:id, estado:true}).then( (ci)=>{    // console.log(ci);  // console.log(ci.length);                                                
                    if (ci.length>0) {
                        ci.forEach( async(i)=>{   //console.log(i._id);                         
                            await ConvocatoriaImg.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true});    
                        })  
                    }
            }),
                        // Eliminar Todos los registros de convocatoriaImg que tienen el id de la img
            NoticiaImg.find({imagen_id:id, estado:true}).then( (ci)=>{    // console.log(ci);  // console.log(ci.length);                                                
                            if (ci.length>0) {
                                ci.forEach( async(i)=>{   //console.log(i._id);                         
                                    await NoticiaImg.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true});    
                                })  
                            }
                    }),
                                // Eliminar Todos los registros de convocatoriaImg que tienen el id de la img
            TallerImg.find({imagen_id:id, estado:true}).then( (ci)=>{    // console.log(ci);  // console.log(ci.length);                                                
                if (ci.length>0) {
                    ci.forEach( async(i)=>{   //console.log(i._id);                         
                        await TallerImg.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true});    
                    })  
                }
        }),

         Image.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true}),

    ]);

    // const image = await Image.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
    res.json(image);    


}




module.exports={
    obtenerImages,
    obtenerImage,
      crearImage,
      actualizarImage,
      eliminarImage,
  
   
}



