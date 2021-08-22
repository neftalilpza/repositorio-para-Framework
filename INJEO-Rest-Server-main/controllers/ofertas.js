const { response } = require('express');
const { Oferta, Carrera, Escuela} = require('../models');





const obtenerOfertas = async(req, res = response ) => {   

     const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, ofertas ] = await Promise.all([
        Oferta.countDocuments(query),
        Oferta.find(query)
            .populate('usuario', 'user_name')
            .populate('escuela', 'nombre')
            .populate('carrera', 'nombre')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);
 
    res.json({
        total,
        ofertas
    }); 
}

const obtenerOferta = async(req, res = response ) => {
    const { id } = req.params;
    const oferta = await Oferta.findById( id )
                                 .populate('usuario', 'user_name')
                                 .populate('escuela', 'nombre')
                                 .populate('carrera', 'nombre')
    res.json( oferta );
} 








const crearOferta = async(req, res = response ) => {

    const fecha_registro = Date.now();


  const {carrera_id, escuela_id} = req.body;
    
  const [ ofertaDB,carreraDB, escuelaDB ] = await Promise.all([

        Oferta.find({ carrera:carrera_id, escuela:escuela_id}),
        Carrera.findById(carrera_id),
        Escuela.findById(escuela_id)
    ]);        
    
    const descripcion = `${escuelaDB.nombre}-${carreraDB.nombre}`.toUpperCase();  
    
/*     const descripcionDB = await Oferta.findOne({descripcion});

    if (descripcionDB) {
        return res.status(400).json({
            msg:`La relación entre las entidades ${descripcion} ya existe`
        });
    } */
   
    if (ofertaDB.length>0) {
        
        if (!ofertaDB[0].estado) {
            await Oferta.findByIdAndUpdate(ofertaDB[0]._id,{estado:true, usuario: req.usuario._id,fecha_registro, descripcion,}, {new: true} );
            return res.status(200).json({
                descripcion,
                escuela:escuelaDB._id,
                carrera: carreraDB._id,
                usuario: req.usuario._id,
                fecha_registro
            })
        } else {
            return res.status(400).json({
            msg:`Actualmente la escuela: '${escuelaDB.nombre}' ya cuenta con la carrera de: '${carreraDB.nombre}'`.toUpperCase(),
                
            });  
        }

    }




   
        // Generar la data a guardar
       const data = {
            descripcion,
            carrera:carreraDB._id,
            escuela:  escuelaDB._id,
            usuario: req.usuario._id,
            fecha_registro
       }   
   

    const oferta = new Oferta(data);
    await oferta.save();
    res.status(201).json(oferta);


}















const actualizarOferta = async( req, res = response ) => {
    const fecha_registro = Date.now();

    // res.json( req.params);
    const { id } = req.params;
    const {carrera_id,escuela_id} = req.body;
    // const { estado, usuario, descripcion, carrera_id, escuela_id,...data } = req.body;
    


    const [ofertaDB, carreraDB, escuelaDB ] = await Promise.all([   
        Oferta.find({ carrera:carrera_id, escuela:escuela_id}),

          Carrera.findById(carrera_id),
          Escuela.findById(escuela_id)
      ]);        




      const descripcion = `${escuelaDB.nombre}-${carreraDB.nombre}`.toUpperCase();      

     

      
    //   const descripcionDB = await Oferta.findOne({descripcion});
/*   
      if (descripcionDB&&descripcionDB.id!==id) {
          return res.status(400).json({
              msg:`La relación entre las entidades ${descripcion} ya existe`
          });
      } */
      

    if (ofertaDB.length>0) {
    
        if (!ofertaDB[0].estado) {
            await Oferta.findByIdAndUpdate(ofertaDB[0]._id,{estado:true, usuario:req.usuario._id, fecha_registro}, {new: true} );
            return res.status(200).json({
                descripcion,
                escuela:escuelaDB._id,
                carrera: carreraDB._id,
                usuario: req.usuario._id
            })
        } else {
           
            if (ofertaDB[0]._id!=id) {
                return res.status(400).json({
                    msg:`Actualmente la escuela: '${escuelaDB.nombre}' ya cuenta con la carrera de: '${carreraDB.nombre}'`.toUpperCase(),
                        
                    }); 
            }  

             
        }

    }


    
    

const data ={
    descripcion,
    carrera:carrera_id,
    escuela:escuela_id,
    usuario: req.usuario._id,
    fecha_registro

}



    

    const oferta = await Oferta.findByIdAndUpdate(id, data, { new: true });
    res.json( oferta); 
  
   

}
 
const borrarOferta = async(req, res =response ) => {

    const { id } = req.params;
    const ofertaBorrada = await Oferta.findByIdAndUpdate( id, { estado: false }, {new: true });
    res.json( ofertaBorrada );
}


const buscarRelacion = async(req, res =response ) => {

const {id, coleccion}= req.params;

let modelo;


switch (coleccion) {
    case 'escuelas':
            buscarCarrerasEnEscuela(id, res);
        break;

    case 'carreras':
            buscarEscuelasPorCarrera(id,res);
        break;

    default:
       return res.status(500).json({ msg: 'Coloección en desarollo'});

        break;
}

// console.log(req.params);
}

const buscarCarrerasEnEscuela=async(id= '', res= response)=>{

const query={estado:true, escuela:id};
    const [escuela,total,carreras]= await Promise.all( [
            Escuela.findById(id),
            Oferta.countDocuments(query),
            // Oferta.find({estado:true, escuela:id}, {carrera:1, _id:0})
            Oferta.find({estado:true, escuela:id}, {carrera:1,})     
                                // .populate('carrera',['nombre'])
                                // .sort({fecha_registro:-1})
                                
                                .sort({fecha_registro:-1})
                                .populate([{
                                    // sort: {nombre:-1},
                                    path: 'carrera',
                                    select:{__v:false},
                                        populate:{
                                            path : 'usuario',
                                            select:{__v:false, password:false}
                                        }
                                }])                               
        ]);

        if (!escuela || !escuela.estado) {
            return   res.status(401).json({
            msg: `La escuela ${id}, no existe`
            });        
        }



    return res.json({
        'Escuela': escuela.nombre,
        total,
        // results:(carreras) ? [carreras] :[],
        results:carreras,
    });    
}

const buscarEscuelasPorCarrera=async(id= '', res= response)=>{

const query={estado:true, carrera:id};

    const [carrera,total,escuelas]= await Promise.all( [
            Carrera.findById(id),
            Oferta.countDocuments(query),
            // Oferta.find({estado:true, escuela:id}, {carrera:1, _id:0})
            Oferta.find({estado:true, carrera:id}, {escuelas:1,})     
                                // .populate('escuela',['nombre']) 
                                .sort({fecha_registro:-1})
                                .populate([{
                                    // sort: {nombre:-1},
                                    path: 'escuela',
                                    select:{__v:false},
                                        populate:{
                                            path : 'usuario',
                                            select:{__v:false, password:false}
                                        }
                                }])                                
        ]);

        if (!carrera || !carrera.estado) {
            return   res.status(401).json({
            msg: `La carrera ${id}, no existe`
            });        
        }

    return res.json({
        'Carrera': carrera.nombre,
        total,
        // results:(escuelas) ? [escuelas] :[],
        results:escuelas,
    });    
}




module.exports = {
    crearOferta,
    obtenerOfertas,
    obtenerOferta,
    actualizarOferta,
    borrarOferta,
    buscarRelacion,
}