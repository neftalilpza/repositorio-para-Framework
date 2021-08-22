const { Schema, model } = require("mongoose")

const ForoSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
       
    },
    descripcion: {
        type: String,
   
       
    },


    usuario_id: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
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

ForoSchema.methods.toJSON =function () {
    const {__v, estado, ...data}= this.toObject();
    return data;
}

module.exports= model('Foro', ForoSchema);

