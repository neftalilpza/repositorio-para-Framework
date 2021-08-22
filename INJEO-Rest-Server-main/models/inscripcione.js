
const { Schema, model } = require('mongoose');


const InscripcioneSchema = Schema({

    descripcion: {
        type: String,
        
        required:true,
        
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    
    taller: {
        type: Schema.Types.ObjectId,
        ref: 'Taller',
        required: true
    },

    estado: {
        type: Boolean,
        default:true,
        required:true,
        
    },

  
    responsable_registro: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fecha_registro: {
        type:  Date,
            
    },

    fecha_eliminacion: {
        type:  Date,
            
    },


    

 


    
});


InscripcioneSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Inscripcione', InscripcioneSchema );
 