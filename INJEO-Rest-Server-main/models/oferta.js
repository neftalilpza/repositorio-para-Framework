const { Schema, model } = require('mongoose');

const OfertaSchema = Schema({

    descripcion: {
        type: String,
        
        required:true,
        
    },
    estado: {
        type: Boolean,
        default:true,
        required:true,
        
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    escuela: {
        type: Schema.Types.ObjectId,
        ref: 'Escuela',
        required: true
    },

    carrera: {
        type: Schema.Types.ObjectId,
        ref: 'Carrera',
        required: true
    },
    fecha_registro: {
        type:  Date,
            
    },
    fecha_eliminacion: {
        type:  Date,
            
    },


    
});


OfertaSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Oferta', OfertaSchema );
