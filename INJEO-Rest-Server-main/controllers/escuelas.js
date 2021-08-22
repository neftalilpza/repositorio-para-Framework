const { response } = require('express');
const { Escuela , Oferta} = require('../models');


const obtenerEscuelas = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, escuelas ] = await Promise.all([
        Escuela.countDocuments(query),
        Escuela.find(query)
            .sort({fecha_registro:-1})
            // .populate('usuario', 'user_name')
            .populate('usuario', {password:0, __v:0})

            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        escuelas    
    });
}

const obtenerEscuela = async(req, res = response ) => {

    const { id } = req.params;
    const escuela = await Escuela.findById( id )
    .populate('usuario', {password:0, __v:0});
    
    // .populate('usuario', 'user_name');

    res.json( escuela );

}

const crearEscuela = async(req, res = response ) => {
 const fecha_registro = Date.now();


   const  nombre =req.body.nombre.toUpperCase().trim();   
const enlace = req.body.enlace.trim();
 const escuelaDB = await Escuela.findOne({ nombre, estado:true });

/*  if ( escuelaDB ) {
    if (!escuelaDB.estado) {
        await Escuela.findByIdAndUpdate( escuelaDB._id, { estado : true, usuario: req.usuario._id, fecha_registro}, { new: true })
        return res.status(200).json({
            nombre,
            usuario:req.usuario._id,
            fecha_registro
        })
    } else{
        return res.status(400).json({
            msg: `La escuela ${ escuelaDB.nombre }, ya existe`
        });
    }
   
} */

if (escuelaDB) {
    return res.status(400).json({
        msg: `La escuela: ${ escuelaDB.nombre }, ya existe`
    });
}


    // Generar la data a guardar
    const data = {
       nombre,      
       enlace, 
        usuario: req.usuario._id,
        fecha_registro,
    }   
    
    // console.log(data);
    const escuela = new Escuela( data );
    // Guardar DB
    await escuela.save();
    res.status(201).json(escuela);
}

const actualizarEscuela = async( req, res = response ) => {
    // const fecha_registro = Date.now();
 
    const { id } = req.params;
    const { estado, usuario, fecha_registro, fecha_eliminacion, ...data } = req.body;

    data.nombre  = data.nombre.toUpperCase(); 
   
    const escuelaDB = await Escuela.findOne( { nombre:data.nombre}  );

/*     if (escuelaDB) {
        if (!escuelaDB.estado) {
            await Escuela.findByIdAndUpdate( escuelaDB._id, { estado: true, usuario: req.usuario._id , fecha_registro}, {new: true} )
            return res.status(200).json({
                nombre:data.nombre,
                usuario: req.usuario._id,
                fecha_registro,
            })
                } else {
            if (escuelaDB._id!=id) {
                return res.status(400).json({
                    msg: `La escuela ${ escuelaDB.nombre }, ya existe`
                })
            }            
        }
    }
     */

    if (escuelaDB && escuelaDB._id!=id) {
        return res.status(400).json({
            msg: `La escuela: ${ escuelaDB.nombre }, ya existe`
        });
    }
    
    
    
    const escuela = await Escuela.findByIdAndUpdate(id, data, { new: true });

    res.json( escuela);

}
 
const borrarEscuela = async(req, res =response ) => {
    const fecha_eliminacion = Date.now();

    const { id } = req.params;
 const [escuelaBorrada, ofertas] = await Promise.all([
    Escuela.findByIdAndUpdate( id, { estado: false, fecha_eliminacion }, {new: true }),
/**
 * 
 */
    Oferta.find({escuela:id, estado:true}).then( (esc)=>{
        if (esc.length>0) {
            esc.forEach(async (i)=>{
                await Oferta.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true})
            })
        }
    }),
 ]) 
    // const escuelaBorrada = await Escuela.findByIdAndUpdate( id, { estado: false, fecha_eliminacion }, {new: true });

    res.json( escuelaBorrada );
}




module.exports = {
    crearEscuela,
    obtenerEscuelas,
    obtenerEscuela,
    actualizarEscuela,
    borrarEscuela,
}