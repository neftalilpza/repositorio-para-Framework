const { Schema, model} = require('mongoose');


const InstructoresTallereSchema= Schema({
   
    taller_id: {
        type: Schema.Types.ObjectId,
        ref: 'Taller',
        required:true,
    },

    instructor_id: {
        type: Schema.Types.ObjectId,
        ref: 'Instructore',
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

InstructoresTallereSchema.methods.toJSON= function () {
    const {__v,... data}= this.toObject();
    return data;
}

module.exports = model('InstructoresTallere',InstructoresTallereSchema);



