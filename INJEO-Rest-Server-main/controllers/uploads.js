const path = require('path');  ///esto es importación  propiade node
const fs = require('fs');

//back end  autirizado por cloudinary
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);



const { response } = require("express");
const { subirArchivo } = require("../helpers");

const { 
      Usuario, 
      Noticia, 
      Taller, 
      Apoyo,
      Beca,
      BolsaTrabajo,
      Carrera,
      Convocatoria,
      Escuela,
      Participante,
      Instructor,
      RedSocial,
      Webinar,

} = require('../models/index');


 
const cargarArchivo =async(req, res= response)=>{
  /*   let sampleFile;
  let uploadPath; */
  /* ESto lo volvimos middlewer
   if (!req.files || Object.keys(req.files).length === 0|| !req.files.archivo) {
     res.status(400).json(  {  msg:'No hay arcchivos que subir '  }  );
    return;
  } */
 

  try {
      // Imagenes o cuallquier tipo de archivo
    // const nombre= await subirArchivo(req.files,['txt','md'], 'textos');
    const nombre= await subirArchivo(req.files,undefined, 'imgs');
    res.json({nombre });

  } catch (msg) {
    res.status(400).json({
      msg
    }) 
  }




}



/**
 * 
 */
// const actualizarImagen = async (req, res = response)=>{
// /* lo volvimos middlewara
//   if (!req.files || Object.keys(req.files).length === 0|| !req.files.archivo) {
//     res.status(400).json(  {  msg:'No hay arcchivos que subir '  }  );
//    return;
//  } */

//   const {id, coleccion} = req.params;

//  let modelo;

//  switch (coleccion) {
//    case 'usuarios':
//      ///tenemos que verificar que exista
//      modelo = await Usuario.findById(id);
//      if (!modelo) {
//         return res.status(400).json({
//           msg:`No existe un usuario con el id ${ id}`
//         })
//      }
//      break;


//      case 'noticias':
//      ///tenemos que verificar que exista
//      modelo = await Noticia.findById(id);
//      if (!modelo) {
//         return res.status(400).json({
//           msg:`No existe una noticia con el id ${ id}`
//         })
//      }
//      break;
 
//    default:
//      return res.status(500).json({ msg: 'Esta colección se encuentra en desarollo o no existe'});
     
//  }

// ///Limpiar imagenes previas
// if (modelo.img) {
//   // Hay que borrar la imagen del servidor 
//   const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
//   if (fs.existsSync( pathImagen)) {
//     fs.unlinkSync( pathImagen);
//   }
  
// }

//  const nombre= await subirArchivo(req.files,undefined, coleccion);
// modelo.img = nombre;
// await modelo.save();



//   res.json(modelo);


// }

/**
 * 
 */

 const actualizarImagenCloudinary = async (req, res = response)=>{
     const {id, coleccion} = req.params;  
   let modelo;
  
   switch (coleccion) {


      case 'usuarios':      
       modelo = await Usuario.findById(id);
       if (!modelo||!modelo.estado) {
          return res.status(400).json({
            msg:`No existe un usuario con el id ${ id}`
          })
       }
       break;
  
  
       case 'noticias':       
       modelo = await Noticia.findById(id);
       if (!modelo||!modelo.estado) {
          return res.status(400).json({
            msg:`No existe una noticia con el id ${ id}`
          })
       }
       break;
    
       case 'apoyos':       
       modelo = await Apoyo.findById(id);
       if (!modelo || !modelo.estado) {
          return res.status(400).json({
            msg:`No existe un apoyo con el id ${ id}`
          })
       }
       break;
   
    
       case 'becas':       
       modelo = await Beca.findById(id);
       if (!modelo || !modelo.estado) {
          return res.status(400).json({
            msg:`No existe una beca con el id ${ id}`
          })
       }
       break;
   
    
       case 'bolsas':       
       modelo = await BolsaTrabajo.findById(id);
       if (!modelo || !modelo.estado) {
          return res.status(400).json({
            msg:`No existe una bolsa de trabajo con el id ${ id}`
          })
       }
       break;
   
    
       case 'carreras':       
       modelo = await Carrera.findById(id);
       if (!modelo || !modelo.estado) {
          return res.status(400).json({
            msg:`No existe una carrera con el id ${ id}`
          })
       }
       break;
   
    
       case 'convocatorias':       
       modelo = await Convocatoria.findById(id);
       if (!modelo || !modelo.estado ) {
          return res.status(400).json({
            msg:`No existe una convocatoria con el id ${ id}`
          })
       }
       break;
   
    
       case 'escuelas':       
       modelo = await Escuela.findById(id);
       if (!modelo || !modelo.estado) {
          return res.status(400).json({
            msg:`No existe una escuela con el id ${ id}`
          })
       }
       break;
   
    
       case 'talleres':       
       modelo = await Taller.findById(id);
       if (!modelo || !modelo.estado ) {
          return res.status(400).json({
            msg:`No existe un taller con el id ${ id}`
          })
       }
       break;

       case 'participantes':       
       modelo = await Participante.findById(id);
       if (!modelo || !modelo.estado ) {
          return res.status(400).json({
            msg:`No existe un participante con el id ${ id}`
          })
       }
       break;

       case 'instructores':       
       modelo = await Instructor.findById(id);
       if (!modelo || !modelo.estado ) {
          return res.status(400).json({
            msg:`No existe un instructor con el id ${ id}`
          })
       }
       break;

       case 'redes':       
       modelo = await RedSocial.findById(id);
       if (!modelo || !modelo.estado ) {
          return res.status(400).json({
            msg:`No existe una red con el id ${ id}`
          })
       }
       break;
   
    
       case 'webinars':       
       modelo = await Webinar.findById(id);
       if (!modelo || !modelo.estado ) {
          return res.status(400).json({
            msg:`No existe un webinar con el id ${ id}`
          })
       }
       break;
   
    
   
     default:
       return res.status(500).json({ msg: 'Coloección en desarollo'});
       
   }
  
  ///Limpiar imagenes previas
  if (modelo.img) {
    const nombreArr = modelo.img.split('/');///El arreglo del nombre del archivo
    const nombre = nombreArr[ nombreArr.length -1 ];//para obtener el ultimo, es decir el puro noombre
    const [ public_id ]= nombre.split('.');//Desestructurar el nombre, y obtener el puro nombre 
    cloudinary.uploader.destroy(public_id);//Este es para remplazar la imagen
  
  }
  

  const { tempFilePath }= req.files.archivo;
  const { secure_url} = await cloudinary.uploader.upload(tempFilePath);
  modelo.img = secure_url;
    await modelo.save();  
    res.json(modelo);
    
    

  }
  /**
   * 
   */




const mostrarImagen =async(req, res = response)=>{

  const {id, coleccion} = req.params;

  let modelo;
 
  switch (coleccion) {
    case 'usuarios':
      ///tenemos que verificar que exista
      modelo = await Usuario.findById(id);
      if (!modelo) {
         return res.status(400).json({
           msg:`No existe un usuario con el id ${ id}`
         })
      }
      break;
 
 
      case 'productos':
      ///tenemos que verificar que exista
      modelo = await Producto.findById(id);
      if (!modelo) {
         return res.status(400).json({
           msg:`No existe un producto con el id ${ id}`
         })
      }
      break;
  
    default:
      return res.status(500).json({ msg: 'Colección en desarrollo'});
      
  }
 
 ///Limpiar imagenes previas
 if (modelo.img) {
  //  console.log(modelo.img);
   // Hay que borrar la imagen del servidor 

  


   const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
   if (fs.existsSync( pathImagen)) {   
    return  res.sendFile(pathImagen)
   }
   
 }
  
 
  //  res.json({     msg:'Falta placeHolder'   });
  const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
  res.sendFile(pathImagen);


}






module.exports={

    actualizarImagenCloudinary,
}

