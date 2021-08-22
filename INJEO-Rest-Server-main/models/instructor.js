const { Schema, model} = require('mongoose');





const InstructoreSchema= Schema({
   
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    
    descripcion:{
        type: String,
        required:true,

    },

    img: {
        type: String,
       
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

InstructoreSchema.methods.toJSON= function () {
    const {__v,... data}= this.toObject();
    return data;
}

module.exports = model('Instructore',InstructoreSchema);



