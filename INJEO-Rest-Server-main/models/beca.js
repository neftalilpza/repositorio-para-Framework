const { Schema, model } = require("mongoose")

const BecaSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
       
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
       
    },
    requisitos: {
        type: String,
        required: [true, 'Los requisitos son obligatorios'],
               
    },
    enlace: {
        type: String,
        required: [true, 'El enlace es obligatorio'],               
    },

    img: {
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
  
BecaSchema.methods.toJSON =function () {
    const {__v, estado, ...data}= this.toObject();
    return data;
}

module.exports= model('Beca', BecaSchema);

