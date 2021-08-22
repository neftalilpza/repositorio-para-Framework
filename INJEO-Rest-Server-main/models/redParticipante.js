const { Schema, model} = require('mongoose');


const RedesSocialesParticipanteSchema= Schema({
   
    
    red_id: {
        type: Schema.Types.ObjectId,
        ref: 'RedesSociale',
        required:true,
    },

 
    participante_id: {
        type: Schema.Types.ObjectId,
        ref: 'Participante',
        required:true,
    },

    url: {
        type: String,
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

RedesSocialesParticipanteSchema.methods.toJSON= function () {
    const {__v,... data}= this.toObject();
    return data;
}

module.exports = model('RedesSocialesParticipante',RedesSocialesParticipanteSchema);



