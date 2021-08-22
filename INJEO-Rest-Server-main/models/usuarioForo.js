const { Schema, model } = require("mongoose")

const UsuariosForoSchema = Schema({
  
    comentario: {
        type: String,
      
       
    }, 

    usuario_id: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required:true,        
    },

    foro_id: {
        type: Schema.Types.ObjectId,
        ref: 'Foro',
        required:true,        
    },


    estado: {
        type: Boolean,
        required: true,
        default:true,
       
    },
    fecha_registro: {
        type:  Date,
            
    },
    fecha_eliminacion: {
        type:  Date,
            
    },

});

UsuariosForoSchema.methods.toJSON =function () {
    const {__v, estado, ...data}= this.toObject();
    return data;
}

module.exports= model('UsuariosForo', UsuariosForoSchema);

