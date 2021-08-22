const { response } = require('express');
const { Taller, InstructorTaller, TallerImg, Inscripccion} = require('../models');


const obtenerTalleres = async(req, res = response ) => {

    const { limite = 5, desde = 0 ,estado=true} = req.query;
    const query = { estado};

    const [ total, talleres ] = await Promise.all([
        Taller.countDocuments(query),
        Taller.find(query)
        .sort({fecha_registro:-1})

            .populate('usuario', {password:0, __v:0})
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        talleres
    });
}

const obtenerTaller = async(req, res = response ) => {

    const { id } = req.params;
    const taller = await Taller.findById( id )
                            .populate('usuario', {password:0, __v:0});

    res.json( taller );

}

const crearTaller = async(req, res = response ) => {
    const fecha_registro = Date.now();

   const { titulo,subtitulo, descripcion, enlace}=req.body;
    // titulo = titulo.toUpperCase();

    // const tituloDB = await Noticia.findOne({ titulo });

/*     if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    } */

    // Generar la data a guardar
    const data = {
        "titulo":titulo.toUpperCase(),
        subtitulo,
        descripcion,
        enlace,
        usuario: req.usuario._id,
        fecha_registro,
    }
   

    
    const taller = new Taller( data );
    // Guardar DB
    await taller.save();

    res.status(201).json(taller);

}

const actualizarTaller = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.titulo  = data.titulo.toUpperCase();
    data.usuario = req.usuario._id;

    
const tallerDB = await  Taller.findById(id);
let permiso = true;
(tallerDB.usuario.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}




    const taller = await Taller.findByIdAndUpdate(id, data, { new: true });

    res.json( taller);

}

const borrarTaller = async(req, res =response ) => {
    const fecha_eliminacion  = Date.now();

    const { id } = req.params;

    
    const tallerDB = await  Taller.findById(id);
    let permiso = true;
    (tallerDB.usuario.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 
    
    if (!permiso ) {    
        return res.status(401).json({
            msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
        }); 
    }
    



    // const tallerBorrado = await Taller.findByIdAndUpdate( id, { estado: false, fecha_eliminacion }, {new: true });
const [tallerBorrado, instructorTaller, tallerImagen, inscripciones] = await Promise.all([
/**
 * 
 */
    Taller.findByIdAndUpdate( id, { estado: false, fecha_eliminacion }, {new: true }),
/**
 * 
 */
    InstructorTaller.find({ taller_id:id, estado:true}).then( (iT)=>{
        if (iT.length>0) {
            iT.forEach ( async (i)=>{
            await    InstructorTaller.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true})
            })
        }
    }),
/**
 * 
 */
TallerImg.find({taller_id:id, estado:true}).then( (tI)=>{
    if (tI.length>0) {
        tI.forEach( async (i)=>{
            await TallerImg.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion}, {new:true})
        })
    }
}),
/**
 * 
 */
Inscripccion.find({taller:id, estado:true}).then( (ins)=>{
    if (ins.length>0) {
        ins.forEach( async (i)=>{
            await Inscripccion.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion}, {new:true})
        })
    }
}),




])




    res.json( tallerBorrado );
}




module.exports = {
    crearTaller,
    obtenerTaller,
    obtenerTalleres,
    actualizarTaller,
    borrarTaller,
}