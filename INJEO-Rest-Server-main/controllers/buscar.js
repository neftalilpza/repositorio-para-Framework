const {response, request}= require('express');

//  El object id es para saber si es un MOngoID
const {ObjectId}= require('mongoose').Types;

const {
    Apoyo,
    Beca,
    BolsaTrabajo,
    Carrera,
    Convocatoria,
    Escuela,
    Externo,
    Foro,
    Inscripccion,
    Usuario,
    Noticia,
    Oferta,
    Persona,
    Taller,
    Participante,
    Instructor,
    RedSocial
}= require('../models/index');

const coleccionesPermitidas=[
    'apoyos',
    'becas',
    'bolsaTrabajos',
    'carreras',
    'convocatorias',
    'escuelas',
    'externos',
    'foros',
    'inscripciones',
    'usuarios',
    'noticias',
    'ofertas',
    'personas',
    'talleres',
    'participantes'
    ,'instructores',
    'redes'
];

/**
 *  Búsqueda De Usuario
 */
const buscarUsuarios= async(termino = '', res = response)=>{
    const esMongoID = ObjectId.isValid( termino );//true
    // Busqueda por ID
    if (esMongoID) {
            const usuario = await Usuario.findById(termino);
           return res.json({
                results: ( usuario && usuario.estado ) ? [ usuario] :[]
            });
    }
    // solo por user_name
    // expresiones regulares  
    const regex = new RegExp(termino,'i');
    const usuarios = await Usuario.find({
        $or: [{user_name:regex},{correo:regex}], //Puede ser una de estas condiciones
        $and: [ {estado:true}] //y tiene que cumplir esta condicion 
    });
    res.json({
        results:usuarios
    });
}


/**
 *  Búsqueda De Persona
 */
const buscarPersona= async(termino = '', res = response)=>{
    
    const esMongoID = ObjectId.isValid( termino )
    
    if (esMongoID) {
        const persona = await Persona.findById(termino).populate('usuario_id',['user_name']);
        return res.json({
            results: ( persona && persona.estado ) ? [ persona] :[]
        });
    }

    const regex = new RegExp(termino,'i');
    const personas = await Persona.find({
        $or: [  {nombre:regex}, {apellido_paterno:regex}, {apellido_materno:regex}    ],
        $and: [ {estado:true}] 
    }).populate('usuario_id',['user_name']);

    res.json({
        results:personas
    });

}

/**
 *  Búsqueda De Externo
 */
const buscarExterno= async(termino = '', res = response)=>{
    
    const esMongoID = ObjectId.isValid( termino );
    
    if (esMongoID) {
        const externo = await Externo.findById(termino).populate('usuario_id',['user_name']);
        return res.json({
            results: ( externo && externo.estado) ? [ externo] :[]
        });
    }
    const regex = new RegExp(termino,'i');
    const externos = await Externo.find({
        $or: [  {nombre:regex},    ],
        $and: [ {estado:true}] 
    }).populate('usuario_id',['user_name']);

    res.json({
        results:externos
    });

}

/**
 *  Búsqueda De Apoyo
 */
const buscarApoyo= async(termino = '', res = response)=>{
    
    const esMongoID = ObjectId.isValid( termino );
    
    if (esMongoID) {
        const apoyo = await Apoyo.findById(termino).populate('usuario_id',['user_name']);
        return res.json({
            results: ( apoyo && apoyo.estado ) ? [ apoyo] :[]
        });
    }
    const regex = new RegExp(termino,'i');
    const apoyos = await Apoyo.find({
        $or: [  {titulo:regex},    ],
        $and: [ {estado:true}] 
    }).populate('usuario_id',['user_name']);

    res.json({
        results:apoyos
    });

}

/**
 *  Búsqueda De Becas
 */
const buscarBecas= async(termino = '', res = response)=>{
    
    const esMongoID = ObjectId.isValid( termino );
    
    if (esMongoID) {
        const beca = await Beca.findById(termino).populate('usuario_id',['user_name']);
        return res.json({
            results: ( beca && beca.estado ) ? [ beca] :[]
        });
    }
    const regex = new RegExp(termino,'i');
    const becas = await Beca.find({
        $or: [  {titulo:regex},    ],
        $and: [ {estado:true}] 
    }).populate('usuario_id',['user_name']);

    res.json({
        results:becas
    });

}

/**
 *  Búsqueda De Bolsas
 */
const buscarbolsas= async(termino = '', res = response)=>{
    
    const esMongoID = ObjectId.isValid( termino );
    
    if (esMongoID) {
        const bolsa = await BolsaTrabajo.findById(termino).populate('usuario_id',['user_name']);;
        return res.json({
            results: ( bolsa && bolsa.estado ) ? [ bolsa] :[]
        });
    }
    const regex = new RegExp(termino,'i');
    const bolsas = await BolsaTrabajo.find({
        $or: [  {titulo:regex},    ],
        $and: [ {estado:true}] 
    }).populate('usuario_id',['user_name']);

    res.json({
        results:bolsas
    });

}

/**
 *  Búsqueda De Carrera
 */
const buscarCarrera= async(termino = '', res = response)=>{
    
    const esMongoID = ObjectId.isValid( termino );
    
    if (esMongoID) {
        const carrera = await Carrera.findById(termino).populate('usuario',['user_name']);
        return res.json({
            results: ( carrera && carrera.estado ) ? [ carrera] :[]
        });
    }
    const regex = new RegExp(termino,'i');
    const carreras = await Carrera.find({
        $or: [  {nombre:regex},    ],
        $and: [ {estado:true}] 
    }).populate('usuario',['user_name']);

    res.json({
        results:carreras
    });

}

/**
 *  Búsqueda De Convocatorias
 */
const buscarConvocatoria= async(termino = '', res = response)=>{
    
    const esMongoID = ObjectId.isValid( termino );
    
    if (esMongoID) {
        const convocatoria = await Convocatoria.findById(termino).populate('usuario',['user_name']);
        return res.json({
            results: ( convocatoria && convocatoria.estado ) ? [ convocatoria] :[]
        });
    }
    const regex = new RegExp(termino,'i');
    const convocatorias = await Convocatoria.find({
        $or: [  {titulo:regex},    ],
        $and: [ {estado:true}] 
    }).populate('usuario',['user_name']);

    res.json({
        results:convocatorias
    });

}

/**
 *  Búsqueda De Escuela
 */
const buscarEscuela= async(termino = '', res = response)=>{
    
    const esMongoID = ObjectId.isValid( termino );
    
    if (esMongoID) {
        const escuela = await Escuela.findById(termino).populate('usuario',['user_name']);
        return res.json({
            results: ( escuela&&escuela.estado ) ? [ escuela] :[]
        });
    }
    const regex = new RegExp(termino,'i');
    const escuelas = await Escuela.find({
        $or: [  {nombre:regex},    ],
        $and: [ {estado:true}] 
    }).populate('usuario',['user_name']);

    res.json({
        results:escuelas
    });

}

/**
 *  Búsqueda De Foro
 */
const buscarForo= async(termino = '', res = response)=>{
    
    const esMongoID = ObjectId.isValid( termino );
    
    if (esMongoID) {
        const foro = await Foro.findById(termino).populate('usuario_id',['user_name']);
        return res.json({
            results: ( foro&&foro.estado ) ? [ foro] :[]
        });
    }
    const regex = new RegExp(termino,'i');
    const foros = await Foro.find({
        $or: [  {titulo:regex},    ],
        $and: [ {estado:true}] 
    }).populate('usuario_id',['user_name']);

    res.json({
        results:foros
    });

}

/**
 *  Búsqueda De Inscripción
 */
const buscarInscripcion= async(termino = '', res = response)=>{
    
    const esMongoID = ObjectId.isValid( termino );
    
    if (esMongoID) {
        const inscripcion = await Inscripccion.findById(termino)
                                                .populate('usuario',['user_name'])
                                                .populate('taller',['titulo'])
                                                .populate('responsable_registro',['user_name']);
        return res.json({
            results: ( inscripcion && inscripcion.estado ) ? [ inscripcion] :[]
        });
    }
    const regex = new RegExp(termino,'i');
    const inscripciones = await Inscripccion.find({
        $or: [  {descripcion:regex},    ],
        $and: [ {estado:true}] 
    })
                .populate('usuario',['user_name'])
                .populate('taller',['titulo'])
                .populate('responsable_registro',['user_name'])
                
                ;

    res.json({
        results:inscripciones
    });

}

/**
 *  Búsqueda De Noticia
 */
const buscarNoticia= async(termino = '', res = response)=>{
    
    const esMongoID = ObjectId.isValid( termino );
    
    if (esMongoID) {
        const noticia = await Noticia.findById(termino).populate('usuario',['user_name']);
        return res.json({
            results: ( noticia&&noticia.estado ) ? [ noticia] :[]
        });
    }
    const regex = new RegExp(termino,'i');
    const noticias = await Noticia.find({
        $or: [  {titulo:regex},    ],
        $and: [ {estado:true}] 
    }).populate('usuario',['user_name']);

    res.json({
        results:noticias
    });

}

/**
 *  Búsqueda De Oferta
 */
const buscarOferta= async(termino = '', res = response)=>{
    
    const esMongoID = ObjectId.isValid( termino );
    
    if (esMongoID) {
        const oferta = await Oferta.findById(termino)
                                .populate('usuario',['user_name'])
                                .populate('carrera',['nombre'])
                                .populate('escuela',['nombre'])
                                
                                ;
        return res.json({
            results: ( oferta && oferta.estado ) ? [ oferta] :[]
        });
    }
    const regex = new RegExp(termino,'i');
    const ofertas = await Oferta.find({
        $or: [  {descripcion:regex},    ],
        $and: [ {estado:true}] 
    })  .populate('usuario',['user_name'])
        .populate('carrera',['nombre'])
        .populate('escuela',['nombre']);

    res.json({
        results:ofertas
    });

}

/**
 *  Búsqueda De Talleres
 */
const buscarTaller= async(termino = '', res = response)=>{
    
    const esMongoID = ObjectId.isValid( termino );
    
    if (esMongoID) {
        const taller = await Taller.findById(termino).populate('usuario',['user_name']);
        return res.json({
            results: ( taller && taller.estado ) ? [ taller] :[]
        });
    }
    const regex = new RegExp(termino,'i');
    const talleres = await Taller.find({
        $or: [  {titulo:regex},    ],
        $and: [ {estado:true}] 
    }).populate('usuario',['user_name']);

    res.json({
        results:talleres
    });

}

/**
 *  Búsqueda De Participantes
 */
const buscarParticipante= async(termino = '', res = response)=>{
    const esMongoID = ObjectId.isValid( termino );
    
    if (esMongoID) {
        const participante = await Participante.findById(termino).populate('usuario_id',['user_name']);
        return res.json({
            results: ( participante && participante.estado ) ? [ participante] :[]
        });
    }

    // const regex = new RegExp(termino,'i');
    const regex = termino.match(/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g)
    function quitarAcentos(cadena){
        const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
        return cadena.split('').map( letra => acentos[letra] || letra).join('').toString();	
    }

    const participantes = await Participante.find(
        {estado:true}
    ).then((p)=>{
        const nt = quitarAcentos(termino);
        const aux=p;
        const regex = new RegExp(aux,'i');
           p.forEach( async (i)=>{
      
        //    const pp=  quitarAcentos(i.nombre);
        //    console.log(pp);
            i.nombre=quitarAcentos(i.nombre);
            })
          
            p.forEach(async (i)=>{
                if (p) {
                    
                }
                    // console.log(regex);
            })
            return p;            
    });

    return res.json({
        participantes
    })
}

/**
 *  Búsqueda De Instructores
 */
const buscarInstructores= async(termino = '', res = response)=>{
    
        const esMongoID = ObjectId.isValid( termino );
        
        if (esMongoID) {
            const instructor = await Instructor.findById(termino).populate('usuario_id',['user_name']);
            return res.json({
                results: ( instructor && instructor.estado ) ? [ instructor] :[]
            });
        }
        const regex = new RegExp(termino,'i');
        const instructores = await Instructor.find({
            $or: [  {nombre:regex},    ],
            $and: [ {estado:true}] 
        }).populate('usuario_id',['user_name']);
    
        res.json({
            results:instructores
        });
    
    }

/**
 *  Búsqueda De Redes
 */
const buscarRedes= async(termino = '', res = response)=>{
    
        const esMongoID = ObjectId.isValid( termino );
        
        if (esMongoID) {
            const red = await RedSocial.findById(termino).populate('usuario_id',['user_name']);
            return res.json({
                results: ( red && red.estado ) ? [ red] :[]
            });
        }
        const regex = new RegExp(termino,'i');
        const redes = await RedSocial.find({
            $or: [  {nombre:regex},    ],
            $and: [ {estado:true}] 
        }).populate('usuario_id',['user_name']);
    
        res.json({
            results:redes
        });
    
    }





/**
 * ******************************************************************
 * ******************************************************************
 * ******************************************************************
 */







const buscar =(req= request, res= response)=>{
        const { coleccion, termino}= req.params;

if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
        msg:`Las colecciones permitidas son: '${ coleccionesPermitidas }'`,
    });
}
 
switch (coleccion) {
    
    case 'usuarios':
            buscarUsuarios(termino, res)
        break; 
    case 'personas':
            buscarPersona(termino, res)
        break;
    case 'externos':
            buscarExterno(termino, res);
        break;
    case 'apoyos':
            buscarApoyo(termino, res);
        break;
    case 'becas':
            buscarBecas(termino, res);
        break;
    case 'bolsaTrabajos':
            buscarbolsas(termino, res);
        break;
    case 'carreras':
            buscarCarrera(termino, res);
        break;
    case 'convocatorias':
            buscarConvocatoria(termino, res);
        break;
    case 'escuelas':
            buscarEscuela(termino, res);
        break;
    case 'foros':
            buscarForo(termino, res);
        break;
    case 'inscripciones':
            buscarInscripcion(termino, res);
        break;
    case 'noticias':
            buscarNoticia(termino, res);
        break;
    case 'ofertas':
            buscarOferta(termino, res);
        break;
    case 'talleres':
            buscarTaller(termino, res);
        break;
    case 'participantes':
            buscarParticipante(termino, res);
        break;
    case 'instructores':
            buscarInstructores(termino, res);
        break;
    case 'redes':
            buscarRedes(termino, res);
        break;

    default:
        res.status(500).json({
            msg:'Esta búsqueda se encuentra en desarollo o no existe'
        });

    }

}



module.exports={
    buscar,
}
