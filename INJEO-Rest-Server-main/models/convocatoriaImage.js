const { Schema, model} = require('mongoose');





const ConvocatoriaImageSchema= Schema({
   
    convocatoria_id: {
        type: Schema.Types.ObjectId,
        ref: 'Convocatoria',
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

ConvocatoriaImageSchema.methods.toJSON= function () {
    const {__v,... data}= this.toObject();
    return data;
}

module.exports = model('ConvocatoriaImage',ConvocatoriaImageSchema);



