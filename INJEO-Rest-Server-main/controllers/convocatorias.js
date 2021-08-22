const { response } = require('express');
const { Convocatoria, ConvocatoriaImg } = require('../models');


const obtenerConvocatorias = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, convocatorias ] = await Promise.all([
        Convocatoria.countDocuments(query),
        Convocatoria.find(query)
        .sort({fecha_registro:-1})

            .populate('usuario', {password:0, __v:0})
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        convocatorias
    });
}

const obtenerConvocatoria = async(req, res = response ) => {

    const { id } = req.params;
    const convocatoria = await Convocatoria.findById( id )
                            .populate('usuario',  {password:0, __v:0}  );

    res.json( convocatoria );

}

const crearConvocatoria = async(req, res = response ) => {
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
        fecha_registro,
        usuario: req.usuario._id
    }
   

    
    const convocatoria = new Convocatoria( data );
    // Guardar DB
    await convocatoria.save();

    res.status(201).json(convocatoria);

}

const actualizarConvocatoria = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.titulo  = data.titulo.toUpperCase();
    data.usuario = req.usuario._id;

const convocatoriaDB = await  Convocatoria.findById(id);
let permiso = true;
(convocatoriaDB.usuario.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}



    const convocatoria = await Convocatoria.findByIdAndUpdate(id, data, { new: true });

    res.json( convocatoria);

}

const borrarConvocatoria = async(req, res =response ) => {
    const fecha_eliminacion = Date.now();



    const { id } = req.params;


    const convocatoriDB = await  Convocatoria.findById(id);
let permiso = true;
(convocatoriDB.usuario.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}



    // const convocatoriaBorrada = await Convocatoria.findByIdAndUpdate( id, { estado: false }, {new: true });

    const [convocatoriaBorrada,convocatoriaImagen]= await Promise.all([
        Convocatoria.findByIdAndUpdate( id, { estado: false, fecha_eliminacion }, {new: true }),

        ConvocatoriaImg.find({ convocatoria_id:id, estado:true
                }).then((cI)=>{
                    if (cI.length>0) {
                        cI.forEach(async (i)=>{ 
                            await ConvocatoriaImg.findByIdAndUpdate(i._id,{estado:false, fecha_eliminacion},{new:true})
                        })
                    }
                })
        
    ])
    res.json( convocatoriaBorrada );
}




module.exports = {
    crearConvocatoria,
    obtenerConvocatorias,
    obtenerConvocatoria,
    actualizarConvocatoria,
    borrarConvocatoria,
}