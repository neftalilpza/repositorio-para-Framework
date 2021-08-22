const { Schema, model} = require('mongoose');


const ParticipanteNoticiaSchema= Schema({
   
    participante_id: {
        type: Schema.Types.ObjectId,
        ref: 'Participante',
        required:true,
    },

    noticia_id: {
        type: Schema.Types.ObjectId,
        ref: 'Noticia',
        required:true,
    },
  
    estado: {
        type: Boolean,
        default: true
    },

    fecha_registro: {
        type:  Date,        
    },

    fecha_eliminacion: {
        type:  Date,
    }, 
    
    usuario_id: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required:true,
    },
    

});

ParticipanteNoticiaSchema.methods.toJSON= function () {
    const {__v,... data}= this.toObject();
    return data;
}

module.exports = model('ParticipanteNoticia',ParticipanteNoticiaSchema);



