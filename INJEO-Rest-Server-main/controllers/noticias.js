const { response } = require('express');
const { Noticia , NoticiaImg, ParticipanteNoticia} = require('../models');


const obtenerNoticias = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, noticias ] = await Promise.all([
        Noticia.countDocuments(query),
        Noticia.find(query)
        .sort({fecha_registro:-1})
            .populate('usuario', {password:0, __v:0})
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        noticias
    });
}

const obtenerNoticia = async(req, res = response ) => {

    const { id } = req.params;
    const noticia = await Noticia.findById( id )
                            // .populate('usuario', 'user_name');
            .populate('usuario', {password:0, __v:0});


    res.json( noticia );

}

const crearNoticia = async(req, res = response ) => {
    const fecha_registro = Date.now();

   const { titulo,subtitulo, descripcion}=req.body;
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
        usuario: req.usuario._id,
        fecha_registro
    }
   

    
    const noticia = new Noticia( data );
    // Guardar DB
    await noticia.save();

    res.status(201).json(noticia);

}

const actualizarNoticia = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.titulo  = data.titulo.toUpperCase();
    data.usuario = req.usuario._id;

    const noticia = await Noticia.findByIdAndUpdate(id, data, { new: true });

    res.json( noticia);

}

const borrarNoticia = async(req, res =response ) => {
    const fecha_eliminacion = Date.now();

    const { id } = req.params;
    // const noticiaBorrada = await Noticia.findByIdAndUpdate( id, { estado: false , fecha_eliminacion}, {new: true });

const [noticiaBorrada, noticiaImg, participanteNoticia]= await Promise.all([
/**
 * 
 */
    Noticia.findByIdAndUpdate( id, { estado: false , fecha_eliminacion}, {new: true }),
/**
 * 
 */
    NoticiaImg.find({ noticia_id:id, estado:true}).then((nI)=>{
        if (nI.length>0) {
            nI.forEach(async (i)=>{
                await NoticiaImg.findByIdAndUpdate( i._id,{estado:false, fecha_eliminacion},{new:true})
            })
        }
    }),
/**
 * 
 */
    ParticipanteNoticia.find({noticia_id:id, estado:true}).then( (pN)=>{
        if (pN.length>0) {
            pN.forEach( async(i)=>{
                await ParticipanteNoticia.findByIdAndUpdate( i._id,{ estado: false, fecha_eliminacion  },{new:true})
            } )
        }
    } )  


]);



    res.json( noticiaBorrada );
}




module.exports = {
    crearNoticia,
    obtenerNoticias,
    obtenerNoticia,
    actualizarNoticia,
    borrarNoticia,
}