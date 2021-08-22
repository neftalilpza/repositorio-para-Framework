const { Schema, model } = require('mongoose');

const NoticiaSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
       
    },
    subtitulo: {
        type: String,
        required: [true, 'El subtítulo es obligatorio'],
      
    },
    img: {
        type: String,
       
    },


    descripcion:{
        type: String,
        required:true,

    },

    estado: {
        type: Boolean,
        default: true,
        required: true
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fecha_registro: {
        type:  Date,
            
    },
});


NoticiaSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Noticia', NoticiaSchema );
