const { Schema, model} = require('mongoose');


const NoticiaImageSchema= Schema({
   
    noticia_id: {
        type: Schema.Types.ObjectId,
        ref: 'Noticia',
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

NoticiaImageSchema.methods.toJSON= function () {
    const {__v,... data}= this.toObject();
    return data;
}

module.exports = model('NoticiaImage',NoticiaImageSchema);



