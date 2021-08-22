const { Schema, model} = require('mongoose');


const TallerImageSchema= Schema({
   
    taller_id: {
        type: Schema.Types.ObjectId,
        ref: 'Taller',
        required:true,
    },

    imagen_id: {
        type: Schema.Types.ObjectId,
        ref: 'Image',
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

TallerImageSchema.methods.toJSON= function () {
    const {__v,... data}= this.toObject();
    return data;
}

module.exports = model('TallerImage',TallerImageSchema);



