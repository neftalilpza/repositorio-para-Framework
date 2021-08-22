const { Schema, model } = require('mongoose');

const WebinarSchema = Schema({

 
    titulo: {
        type: String,
        required: [true, 'titutlo es obligatorio']
    },

    img: {
        type: String,
       
    }, 
    enlace: {
        type: String,
        required: [true, 'El enlace es obligatorio']
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
     
    estado: {
        type: Boolean,
        default:true,
    },

});


WebinarSchema.methods.toJSON = function () {
    const {__v, ...data} = this.toObject();
    return data;
}

module.exports = model('Webinar', WebinarSchema);


