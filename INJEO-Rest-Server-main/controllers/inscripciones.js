const { response } = require('express');
const { Taller, Usuario, Inscripccion, Oferta} = require('../models');






const obtenerInscripciones = async(req, res = response ) => {   

     const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, inscripciones ] = await Promise.all([
        Inscripccion.countDocuments(query),
        Inscripccion.find(query)
            .populate('usuario', 'user_name')
            .populate('taller', 'titulo')
            .populate('responsable_registro', 'user_name')

          

           
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        inscripciones
    }); 
}

const obtenerInscripcion = async(req, res = response ) => {
    const { id } = req.params;
    const inscripcion = await Inscripccion.findById( id )
                                        .populate('usuario', 'user_name')
                                        .populate('taller', 'titulo')
                                        .populate('responsable_registro', 'user_name')
                            
    res.json( inscripcion );
} 








const crearInscripcion = async(req, res = response ) => {
    const fecha_registro = Date.now();

  const {participante_id, taller_id} = req.body; 

  const [ inscripcionDB,participanteDB, tallerDB ] = await Promise.all([
        // Inscripccion.find({usuario:participante_id, taller:taller_id, estado:true}            
        Inscripccion.findOne({usuario:participante_id, taller:taller_id, estado:true}            
            ),
        Usuario.findById(participante_id),
        Taller.findById(taller_id)
    ]);        
    
    const descripcion = `${participanteDB.user_name} - ${tallerDB.titulo}`.toUpperCase();    

    if (inscripcionDB) {
     return   res.status(401).json({
            msg:`Actualmente: ${participanteDB.user_name}, es participante  en el taller: ${tallerDB.titulo}`,
        })
    }
       
    // const resultados=( inscripcionDB) ? [ inscripcionDB] :[]     

/*    if (inscripcionDB.length>0) {   
       if (!inscripcionDB[0].estado) {
        await Inscripccion.findByIdAndUpdate( inscripcionDB[0]._id, { estado: true , responsable_registro: req.usuario._id, fecha_registro, descripcion},{new:true});
       console.log(fecha_registro);
        return res.status(200).json({
            descripcion,
            usuario:participanteDB._id,
            taller:  tallerDB._id,
            responsable_registro: req.usuario._id, 
            fecha_registro,
        });        
       } else{
        return res.status(400).json({
            msg:`Actualmente ${participanteDB.user_name} es participante  en el taller ${tallerDB.titulo}`,
        });   
       } 
} */   

        // Generar la data a guardar
       const data = {
            descripcion,
            usuario:participanteDB._id,
            taller:  tallerDB._id,
            responsable_registro: req.usuario._id,    
            fecha_registro     
       }   

    const inscripcion = new Inscripccion(data);
    await inscripcion.save();
    res.status(201).json(inscripcion);

}

const actualizarInscripcion = async( req, res = response ) => {
    // const fecha_registro = Date.now();

  
    const { id } = req.params;
    const {participante_id, taller_id} = req.body;    

    // const { estado, usuario, descripcion, carrera_id, escuela_id,...data } = req.body;
    


  
  
  
  
  
  
  
    const [ inscripcionDB,participanteDB, tallerDB ] = await Promise.all([    
            Inscripccion.findOne({ usuario: participante_id, taller:taller_id, estado:true}),
            Usuario.findById(participante_id),
            Taller.findById(taller_id)
      ]);        



      const descripcion = `${participanteDB.user_name} - ${tallerDB.titulo}`.toUpperCase();        
      
/*       const descripcionDB = await Inscripccion.findOne({descripcion});
      if (descripcionDB&&descripcionDB.id!==id) {
          return res.status(400).json({
              msg:`La relación entre las entidades ${descripcion} ya existe`
          });
      } */
    
      const inscripcion_id = await  Inscripccion.findById(id);
      let permiso = true;
      (inscripcion_id.usuario.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 
      
      if (!permiso ) {    
          return res.status(401).json({
              msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
          }); 
      }

      if (inscripcionDB && inscripcionDB._id!=id ) {
        //   console.log('Ya existe');
          return   res.status(401).json({
            msg:`Actualmente: ${participanteDB.user_name}, es participante  en el taller: ${tallerDB.titulo}`,
        });
      }

    
/*       if (inscripcionDB.length>0) {    
        if (!inscripcionDB[0].estado) {
            await Inscripccion.findByIdAndUpdate(inscripcionDB[0]._id,{estado:true, responsable_registro:req.usuario._id, fecha_registro, descripcion}, {new: true} );
            return res.status(200).json({
                descripcion,
                usuario:participanteDB._id,
                taller:  tallerDB._id,
                responsable_registro: req.usuario._id,    
                fecha_registro                   
            })
        } else {           
            if (inscripcionDB[0]._id!=id) {
                return res.status(400).json({                    
            msg:`Actualmente ${participanteDB.user_name} es participante  en el taller ${tallerDB.titulo}`,                 
                                           }); 
            }               
        }
    } */






const data ={
    descripcion,
    usuario:participanteDB._id, 
    taller:  tallerDB._id,
    responsable_registro: req.usuario._id,   
    // fecha_registro    

}





    const inscripcion = await Inscripccion.findByIdAndUpdate(id, data, { new: true });
    res.json( inscripcion); 
  
   

}
 
const borrarInscripcion = async(req, res =response ) => {
    const fecha_eliminacion = Date.now();

    const inscripcion_id = await  Inscripccion.findById(id);
    let permiso = true;
    (inscripcion_id.usuario.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 
    
    if (!permiso ) {    
        return res.status(401).json({
            msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
        }); 
    }


    const { id } = req.params;
    const inscripcionBorrada = await Inscripccion.findByIdAndUpdate( id, { estado: false, fecha_eliminacion }, {new: true });
    res.json( inscripcionBorrada );
    
}






const buscarRelacion = async(req, res =response ) => {

    const {id, coleccion}= req.params;
    

    switch (coleccion) {
        case 'talleres':
               buscarUsuariosPorTaller(id, res);
             
            break;
    
        case 'usuarios':
               buscarTalleresPorUsuario(id,res);
            break;
    
        default:
           return res.status(500).json({ msg: 'Coloección en desarollo'});
    
            
    } 
    
    // console.log(req.params);
    }
    
    const buscarUsuariosPorTaller=async(id= '', res= response)=>{
    
    const query={estado:true, taller:id};
        const [taller,total,usuarios]= await Promise.all( [
                Taller.findById(id),
                Inscripccion.countDocuments(query),
                Inscripccion.find({estado:true, taller:id}, {usuario:1,})     
                                    .populate('usuario',['user_name'])                                
            ]);
    
            if (!taller || !taller.estado) {
                return  res.status(401).json({
                msg: `El taller: ${id}, no existe`
                });        
            }
    
        return res.json({
            'taller': taller.titulo,
            total,
            // results:(carreras) ? [carreras] :[],
            results:usuarios,
        });    
    }
    
    const buscarTalleresPorUsuario=async(id= '', res= response)=>{
    
    const query={estado:true, usuario:id};
    
        const [usuario, total, talleres]= await Promise.all( [
                Usuario.findById(id),
                Inscripccion.countDocuments(query),
                Inscripccion.find({estado:true, usuario:id}, {taller:1,})     
                                    .populate('taller',['titulo'])                                
            ]);
    
            if (!usuario || !usuario.estado) {
                return res.status(401).json({
                msg: `El usuario ${id}, no existe`
                });        
            }
    
        return res.json({
            'usuario': usuario.user_name,
            total,
            results:talleres,
        });    
    }
    
    
    







module.exports = {
    crearInscripcion,
    obtenerInscripciones,
    obtenerInscripcion,
    actualizarInscripcion,
    borrarInscripcion,
    buscarRelacion,
}