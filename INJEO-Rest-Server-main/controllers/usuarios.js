const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const {Usuario,
     Externo,
     Persona ,
     UsuarioForo,
     Foro,
     Convocatoria,
     Taller,
     Beca,
     Apoyo,
     BolsaTrabajo,
     Inscripccion,
     Participante,
     Instructor,
     Carrera,
     Escuela,
     Oferta,
 }= require('../models/index');
const { generarJWT } = require('../helpers');

const obtenerUsuario = async(req, res = response ) => {
    const { id } = req.params;
    const usuario = await Usuario.findById( id );                         
    res.json( usuario );
}
 
const usuariosGet = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite ))
            .sort({fecha_registro:-1})
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {
    // console.log(req.body );
 const fecha_registro = Date.now();
    const { 
        numero_telefonico,  
         correo, password, rol,     
    } = req.body;

 




    const usuario = new Usuario({    
         correo, password, rol,numero_telefonico, fecha_registro, });

    // // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // // Guardar en BD
    await usuario.save();
 
    //Generar mi jwt
    const token = await generarJWT( usuario.id );

    res.json({
        usuario,
        token
       
    });
}

const usuariosPut = async(req, res = response) => {

    const fecha_registro = Date.now();
    const { id } = req.params;
    
    const { numero_telefonico,  
        correo, rol, user_name    
   } = req.body;

   const correoDB= await Usuario.findOne({correo, estado:true})

 if (correoDB) {
     if (correoDB._id!=id) {
        return res.status(400).json({
            msg:`El correo: '${correoDB.correo}', ya está registrado `,
                
            }); 
     }
 }




/*     // const { _id, password,  correo,  ...resto } = req.body;


    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    } */

    let usuarioDB;
if (req.usuario.rol==='ADMIN_ROLE') {
    // console.log('es igual');    
    usuarioDB = {    
        correo, rol,numero_telefonico, fecha_registro, user_name };
    // console.log(req.usuario.rol);
}else{
    // console.log('no es igual');
     usuarioDB = {    
        correo,numero_telefonico, fecha_registro, user_name};  
}



//    // // Encriptar la contraseña
//    const salt = bcryptjs.genSaltSync();
//    usuarioDB.password = bcryptjs.hashSync( password, salt );




    // const usuario = await Usuario.findByIdAndUpdate( id, resto );

    const usuario = await Usuario.findByIdAndUpdate( id, usuarioDB,{new:true});

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    const [personaRegistrada , externoRegistrado] = await Promise.all([
        Persona.findOne({usuario_id:id , estado:true}),
        Externo.findOne({usuario_id:id , estado:true})        
    ]);

const usuario = await Usuario.findByIdAndUpdate( id, { estado: false },{new:true} );

let dependencia;    
if (personaRegistrada) {
    // console.log('existe en persona');
    dependencia= await Persona.findByIdAndUpdate(personaRegistrada._id,{estado:false},{new:true})
}
if (externoRegistrado) {
    dependencia = await Externo.findByIdAndUpdate(externoRegistrado._id,{estado:false},{new:true})    
    // console.log('existe en externo');
}

const [foros,usuariosForos,convocatorias, talleres, becas, apoyos, bolsas, inscripciones, participantes, instructores, carreras, escuelas, ofertas]= await Promise.all([
/**
 * 
 */
Foro.find({usuario_id:id, estado:true}).then( (foro)=>{
    if (foro.length>0) {
        foro.forEach( async (i)=>{
            await Foro.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true})
        })
    }
}),
/**
 * 
 */
UsuarioForo.find({ usuario_id:id, estado:true}).then( (uF)=>{
            if (uF.length>0) {
                uF.forEach(async (i)=>{
                    await UsuarioForo.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true});
                })
            }
    }),

/**
 * 
 */
Convocatoria.find({ usuario_id:id, estado:true}).then( (conv)=>{
      if (conv.length>0) {
          conv.forEach( async(i)=>{
              await Convocatoria.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true})
          });      
        }
}),
/**
 * 
 */
 Taller.find({ usuario:id, estado:true}).then( (t)=>{
      if (t.length>0) {
          t.forEach( async(i)=>{
              await Taller.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true})
          });      
        }
}),
/**
 * 
 */
 Beca.find({ usuario_id:id, estado:true}).then( (b)=>{
      if (b.length>0) {
          b.forEach( async(i)=>{
              await Beca.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true})
          });      
        }
}),
/**
 * 
 */
 Apoyo.find({    usuario_id:id, estado:true}).then( (a)=>{
      if (a.length>0) {
          a.forEach( async(i)=>{
              await Apoyo.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true})
          });      
        }
}),
/**
/**
 * 
 */
 BolsaTrabajo.find({    usuario_id:id, estado:true}).then( (bT)=>{
      if (bT.length>0) {
          bT.forEach( async(i)=>{
              await BolsaTrabajo.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true})
          });      
        }
}),
/**
 * 
 */
Inscripccion.find({  usuario:id, estado:true}).then( (ins)=>{
      if (ins.length>0) {
          ins.forEach( async(i)=>{
              await Inscripccion.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true})
          });      
        }
}),
/**
 * 
 */
 Participante.find({  usuario_id:id, estado:true}).then( (part)=>{
    if (part.length>0) {
        part.forEach( async(i)=>{
            await Participante.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true})
        });      
      }
}),
/**
 * 
 */

 Instructor.find({  usuario_id:id, estado:true}).then( (instruc)=>{
    if (instruc.length>0) {
        instruc.forEach( async(i)=>{
            await Instructor.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true})
        });      
      }
}),
/**
 * 
 */
 Carrera.find({  usuario:id, estado:true}).then( (carr)=>{
    if (carr.length>0) {
        carr.forEach( async(i)=>{
            await Carrera.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true})
        });      
      }
}),
/**
 * 
 */
 Escuela.find({  usuario:id, estado:true}).then( (esc)=>{
    if (esc.length>0) {
        esc.forEach( async(i)=>{
            await Escuela.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true})
        });      
      }
}),
/**
 * 
 */
 Oferta.find({  usuario:id, estado:true}).then( (o)=>{
    if (o.length>0) {
        o.forEach( async(i)=>{
            await Oferta.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true})
        });      
      }
}),




]);



    res.json({usuario, dependencia});
}



const buscarRelacion = async(req, res =response ) => {

    const {id, coleccion}= req.params;
    

    switch (coleccion) {
        case 'buscar':
               buscarUsuarioEnColeccion(id, res);
             
            break;
   
  
    
        default:
           return res.status(500).json({ msg: 'Coloección en desarollo'});
    
            
    } 
    
    // console.log(req.params);
    }

    const buscarUsuarioEnColeccion=async(id= '', res= response)=>{
        const query={estado:true, usuario_id:id};
            const [persona]= await Promise.all( [

                    Persona.findOne(query),
                    // RedParticipante.find({estado:true, red_id:id}, {participante_id:1,url:1,})     
                    //                     .populate('participante_id',['nombre'])                                
                ]);
        
                if (persona) {
               return res.json({
                    msg: `persona`
                    });        
                }

                const [externo]= await Promise.all( [
    
                        Externo.findOne(query),
                        // RedParticipante.find({estado:true, red_id:id}, {participante_id:1,url:1,})     
                        //                     .populate('participante_id',['nombre'])                                
                    ]);
                if (externo) {
                    return res.json({
                        msg: `externo`
                        }); 
                } else {
                    return res.status(401).json({
                        msg: `El usuario  : ${id}, no existe dentro de las colecciones, o tiene su registro incompleto`
                        });  
                }   
            
        }

        
    
        const cambiarPassword = async(req, res =response ) => {

            const {id, coleccion}= req.params;
            const  password = req.body.password.trim(); 
        
            switch (coleccion) {
                case 'actualizarPassword':
                     
                    // return res.json({ msg: password });
                    cambiarContraseña(id, res, password);
                  
                    break;
           
          
            
                default:
                   return res.status(500).json({ msg: 'Coloección en desarollo'});
            
                    
            } 
            
            // console.log(req.params);
            }
    



            const cambiarContraseña=async(id= '', res= response, password ='')=>{
                const query={estado:true, usuario_id:id};

                   // // Encriptar la contraseña
   const salt = bcryptjs.genSaltSync();
   const passwordEncriptada  = bcryptjs.hashSync( password, salt );


   const usuario = await Usuario.findByIdAndUpdate(id,{password: passwordEncriptada},{new:true})

             return res.json({
                 usuario
             })
                }


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
    obtenerUsuario,
    buscarRelacion,
    cambiarPassword
}