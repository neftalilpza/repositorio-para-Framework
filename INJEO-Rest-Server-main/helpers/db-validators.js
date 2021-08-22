const Role = require('../models/role');
const{ 
        Beca,
        Usuario,Noticia, 
        Taller, 
        Convocatoria,
        Carrera,
        Escuela , 
        Oferta,
        Inscripccion, 
        Externo, 
        Persona,
        Apoyo,
        BolsaTrabajo,
        Foro,
        Image,

        ConvocatoriaImg,
        NoticiaImg,
        TallerImg,
        Participante,
        Instructor,
        InstructorTaller,
        ParticipanteNoticia,
        RedSocial,
        RedInstructor,
        RedParticipante,
    
    UsuarioForo,
    Webinar,        
    
    }= require('../models/index');


const esRoleValido = async(rol = '') => { 

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo, estado:true });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}
/**
 * Usuario activo
 */
const existeUsuarioActivoPorId = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario.estado ) {
        throw new Error(`El id no existe ${ id }`);
    }
}


const existePersonaPorId = async( id ) => {

    // Verificar si el correo existe
    const existePersona = await Persona.findById(id);
    if ( !existePersona ) {
        throw new Error(`El id no existe ${ id }`);
    }
}








/**
 * PERSONA
 */

 const curpExiste = async( curp = '' ) => {

    // Verificar si el correo existe
    const existeCurp = await Persona.findOne({ curp, estado:true });
    if ( existeCurp ) {
        throw new Error(`la CURP: '${ curp }', ya está registrada`);
    }
}
/**
 * 
 *  Externo RFC
 */
const rfcExiste = async( rfc = '' ) => {

    // Verificar si el correo existe
    const existeRfc = await Externo.findOne({ rfc, estado:true });
    if ( existeRfc ) {
        throw new Error(`El RFC: '${ rfc }', ya está registrado`);
    }
}









/**
 * RELACIÓN EXISTENTE
 */

const existeRelacion = async ( usuario_id= '', roles=[])=>{

/*     const existeUsuario = await Usuario.findById(usuario_id)
    
    if (existeUsuario.rol==='EXTERNO_ROLE') {
        throw new Error(` el usuario: '${usuario_id}' tiene que rol de: '${ existeUsuario.rol }'`);
        
    }  */
    const existeUsuario = await Usuario.findById(usuario_id)
    
    const relacion = roles.includes( existeUsuario.rol );
    if ( !relacion ) {
        // throw new Error(`La colección ${ coleccion } no es permitida, ${ colecciones }`);
    
        throw new Error(` el usuario: '${usuario_id}', tiene el rol de: '${ existeUsuario.rol }', y se require: '${roles}'`);
    
    }
  
}


const existeRelacionConUsuario= async(usuario_id='')=>{

    // Verificar si el correo existe
  
    const [existeUsuarioEnPersona, existeUsuarioEnExterno]= await Promise.all([
        Persona.find({usuario_id:usuario_id, estado:true}),
         Externo.find({usuario_id:usuario_id, estado:true}),
    ]);

    // console.log( existeUsuarioEnPersona.length);
    if ( existeUsuarioEnPersona.length>0 ) {
        throw new Error(`El usuario_id: '${usuario_id}, ya está registrado en la seccion de: 'Personas'`);
    }
    
    // console.log(existeUsuarioEnExterno.length);
    if ( existeUsuarioEnExterno.length>0 ) {
        throw new Error(`El usuario_id: '${usuario_id}, ya está registrado en la seccion de: 'Externos'`);
    }
}












/**************************** */




/**
 * Noticias
 */
 const existeNoticiaPorId = async( id ) => {

    // Verificar si la noticia existe
    const existeNoticia = await Noticia.findById(id);
    if ( !existeNoticia ) {
        throw new Error(`El id no existe ${ id }`);
    }
}
/**
 * Noticias
 */
 const existeNoticiaActivaPorId = async( id ) => {

    // Verificar si la noticia existe
    const existeNoticia = await Noticia.findById(id);
    if ( !existeNoticia.estado ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Talleres
 */
 const existeTallerPorId = async( id ) => {

    // Verificar si la noticia existe
    const existeTaller = await Taller.findById(id);
    if ( !existeTaller ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

 const existeTallerActivoPorId = async( id ) => {

    // Verificar si la noticia existe
    const existeTaller = await Taller.findById(id);
    if ( !existeTaller.estado ) {
        throw new Error(`El id no existe ${ id }`);
    }
}


/**
 * Talleres
 */
 const existeConvocatoriaPorId = async( id ) => {

    // Verificar si la noticia existe
    const existeConvocatoria = await Convocatoria.findById(id);
   
    if ( !existeConvocatoria ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

 const existeConvocatoriaActivaPorId = async( id ) => {

    // Verificar si la noticia existe
    const existeConvocatoria = await Convocatoria.findById(id);
    if ( !existeConvocatoria.estado ) {
        throw new Error(`El id no existe ${ id }`);
    }
}


/**
 * Carreras
 */
 const existeCarreraPorId = async( id ) => {

    // Verificar si la noticia existe
    const existeCarrera = await Carrera.findById(id);
    if ( !existeCarrera ) {
        throw new Error(`El id no existe ${ id }`);
    }
}
/**
 * Escuelas
 */
 const existeEscuelaPorId = async( id ) => {

    // Verificar si la noticia existe
    const existeEscuela = await Escuela.findById(id);
    if ( !existeEscuela ) {
        throw new Error(`El id no existe ${ id }`);
    }
}
/**
 * Oferta Educativa   
 */
 const existeOfertaPorId = async( id ) => {

    // Verificar si la noticia existe
    const existeOferta = await Oferta.findById(id);
    if ( !existeOferta ) {
        throw new Error(`El id no existe ${ id }`);
    }
}
/**
 * Inscripciónes a los talleres
 */
 const existeInscripcionPorId = async( id ) => {

    // Verificar si la noticia existe
    const existeInscripcion = await Inscripccion.findById(id);
    if ( !existeInscripcion ) {
        throw new Error(`El id  ${ id } no existe`);
    }
}

/**
 * Externos
 */
const existeExternoPorId = async( id ) => {

    // Verificar si el correo existe
    const existeExterno = await Externo.findById(id);
    if ( !existeExterno ) {
        throw new Error(`El id no existe ${ id }`);
    }
}







/**
 * Productos
 */
const existeProductoPorId = async( id ) => {

    // Verificar si el correo existe
    const existeProducto = await Producto.findById(id);
    if ( !existeProducto ) {
        throw new Error(`El id no existe ${ id }`);
    }
}





/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );
    if ( !incluida ) {
        throw new Error(`La colección: '${ coleccion }' no es permitida, intente: '${ colecciones }' `);
    }
    return true;
}

 


/**
 * 
 */




/**
 * EXISTE UN ID DE BECA
 */

 const existeBecaPorId = async( id='' ) => {

    const existeId = await Beca.findById(id);
    if ( !existeId ) {
        throw new Error(`El id:'${ id }', no existe`);
    }

}
// Compobar que se encuentra activo
 const existeBecaActivaPorId = async( id='' ) => {

    const existeId = await Beca.findById(id);
    if ( !existeId.estado ) {
        throw new Error(`El id:'${ id }', no existe`);
    }

}





/**
 * EXISTE UN ID DE APOYO
 */

 const existeApoyoPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await Apoyo.findById(id);
    if ( !existeId ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}
// Compobar que se encuentra activo
const existeApoyoActivoPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await Apoyo.findById(id);
    if ( !existeId.estado ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}





/**
 * EXISTE UN ID DE BOLSA
 */

 const existeBolsaPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await BolsaTrabajo.findById(id);
    if ( !existeId ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}
// Compobar que se encuentra activo
const existeBolsaActivaPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await BolsaTrabajo.findById(id);
    if ( !existeId.estado ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}

/**
 * EXISTE UN ID DE FORO
 */

 const existeForoPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await Foro.findById(id);
    if ( !existeId ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}
// Comprobar que se encuentra activo
const existeForoActivoPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await Foro.findById(id);
    if ( !existeId.estado ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}

/**
 * EXISTE UN ID DE CONVOCATORIA-TALLER
 */

 const existeConvocatoriaImgPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await ConvocatoriaImg.findById(id);
    if ( !existeId ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}
// Comprobar que se encuentra activo
const existeConvocatoriaImgActivaPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await ConvocatoriaImg.findById(id);
    if ( !existeId.estado ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}


/**
 * EXISTE UN ID DE Noticia- Taller
 */

 const existeNoticiaImgPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await NoticiaImg.findById(id);
    if ( !existeId ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}
// Comprobar que se encuentra activo
const existeNoticiaImgActivaPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await NoticiaImg.findById(id);
    if ( !existeId.estado ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}

/**
 * EXISTE UN ID DE Taller- Taller
 */

 const existeTallerImgPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await TallerImg.findById(id);
    if ( !existeId ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}
// Comprobar que se encuentra activo
const existeTallerImgActivaPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await TallerImg.findById(id);
    if ( !existeId.estado ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}










/**
 * EXISTE UN ID DE IMAGEN
 */

 const existeImagePorId = async( id='' ) => {
    // Verificar si el correo existe

    const existeId = await Image.findById(id);
    if ( !existeId ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}
// Comprobar que se encuentra activo
const existeImageActivaPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await Image.findById(id);
    if ( !existeId.estado ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}

/**
 * EXISTE UN ID DE PARTICIPANTE
 */
 const existeParticipantePorId = async( id='' ) => {
    // Verificar si el correo existe

    const existeId = await Participante.findById(id);
    if ( !existeId ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}
// Comprobar que se encuentra activo
const existeParticipanteActivoPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await Participante.findById(id);
    if ( !existeId.estado ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}


/**
 * EXISTE UN ID DE INSTRUCTOR
 */
 const existeInstructorPorId = async( id='' ) => {
    // Verificar si el correo existe

    const existeId = await Instructor.findById(id);
    if ( !existeId ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}
// Comprobar que se encuentra activo
const existeInstructorActivoPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await Instructor.findById(id);
    if ( !existeId.estado ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}



/**
 * EXISTE UN ID DE Instructor - Taller
 */

 const existeInstructorTallerPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await InstructorTaller.findById(id);
    if ( !existeId ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}
// Comprobar que se encuentra activo
const existeInstructorTallerActivoPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await InstructorTaller.findById(id);
    if ( !existeId.estado ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}

/**
 * EXISTE UN ID DE Participante - Noticia
 */

 const existeParticipanteNoticiaPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await ParticipanteNoticia.findById(id);
    if ( !existeId ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}
// Comprobar que se encuentra activo
const existeParticipanteNoticiaActivaPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await ParticipanteNoticia.findById(id);
    if ( !existeId.estado ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}

/**
 * EXISTE UN ID DE RED SOCIAL
 */
 const existeRedSocialPorId = async( id='' ) => {
    // Verificar si el correo existe

    const existeId = await RedSocial.findById(id);
    if ( !existeId ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}
// Comprobar que se encuentra activo
const existeRedSocialActivaPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await RedSocial.findById(id);
    if ( !existeId.estado ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}




/**
 * EXISTE UN ID DE Red - Instructores
 */

 const existeRedInstructorPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await RedInstructor.findById(id);
    if ( !existeId ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}
// Comprobar que se encuentra activo
const existeRedInstructorActivoPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await RedInstructor.findById(id);
    if ( !existeId.estado ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}


/**
 * EXISTE UN ID DE Red - participante
 */

 const existeRedParticipantePorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await RedParticipante.findById(id);
    if ( !existeId ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}
// Comprobar que se encuentra activo
const existeRedParticipanteActivoPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await RedParticipante.findById(id);
    if ( !existeId.estado ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}



/**
 * EXISTE UN ID DE Usuario - foro
 */

 const existeUsuarioForoPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await UsuarioForo.findById(id);
    if ( !existeId ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}
// Comprobar que se encuentra activo
const existeUsuarioForoActivoPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await UsuarioForo.findById(id);
    if ( !existeId.estado ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}


/**
 * EXISTE UN ID DE Webinar
 */

 const existeWebinarPorId = async( id='' ) => {
    // Verificar si el  id webinar existe
    const existeId = await Webinar.findById(id);
    if ( !existeId ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}
// Comprobar que se encuentra activo
const existeWebinarActivoPorId = async( id='' ) => {
    // Verificar si el correo existe
    const existeId = await Webinar.findById(id);
    if ( !existeId.estado ) {
        throw new Error(`El id:'${ id }', no existe`);
    }
}





module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,

    existeNoticiaPorId,
    existeNoticiaActivaPorId,

    existeTallerPorId,
    existeTallerActivoPorId,

    existeConvocatoriaPorId,
    existeConvocatoriaActivaPorId,

    existeCarreraPorId,
    coleccionesPermitidas,
    existeEscuelaPorId,
    existeOfertaPorId, 
    existeInscripcionPorId, 
    existeExternoPorId,

  curpExiste,  
  rfcExiste,


  existeRelacion,
  existePersonaPorId,

  existeUsuarioActivoPorId,
  existeRelacionConUsuario,

  existeBecaPorId,
  existeBecaActivaPorId,
  existeBolsaPorId,
  existeBolsaActivaPorId,
  existeApoyoPorId,
  existeApoyoActivoPorId,
  existeForoPorId,
  existeForoActivoPorId,
  
  
 existeImagePorId,
 existeImageActivaPorId,

 existeConvocatoriaImgPorId,
 existeConvocatoriaImgActivaPorId,



 existeNoticiaImgPorId,
 existeNoticiaImgActivaPorId,

 existeTallerImgPorId,
 existeTallerImgActivaPorId,

 existeParticipantePorId,
 existeParticipanteActivoPorId,

 existeInstructorPorId,
 existeInstructorActivoPorId,


 existeInstructorTallerActivoPorId,
 existeInstructorTallerPorId,



 existeParticipanteNoticiaPorId,
 existeParticipanteNoticiaActivaPorId,

 existeRedSocialPorId,
 existeRedSocialActivaPorId,

 existeRedInstructorPorId,
 existeRedInstructorActivoPorId,

 existeRedParticipantePorId,
 existeRedParticipanteActivoPorId,
 
 existeUsuarioForoPorId,
existeUsuarioForoActivoPorId,
  

existeWebinarPorId,
existeWebinarActivoPorId,

}

