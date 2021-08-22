const { Schema, model }= require('mongoose');

const PersonaSchema= Schema({
    nombre: {
        type: String,
        required: [true, 'nombre es obligatorio']
    },
    apellido_paterno: {
        type: String,
        required: [true, 'El apellido paterno es obligatorio']
    },
    apellido_materno: {
        type: String,
        required: [true, 'El apellido materno es obligatorio']
    },

    edad: {
        type: String,
        required: [true, 'La edad es obligatoria']
    },
    sexo: {
        type: String,
        required: [true, 'El sexo es obligatorio'],
        // emun: ['Masculino', 'Femenino']

     
    },
    curp: {
        type: String,
        required: [true, 'La CURP es obligatoria']
    },
    fecha_nacimiento: {
        type: String,
        required: [true, 'La fecha de nacimiento es obligatoria']
    },
    municipio: {
        type: String,
        required: [true, 'El municipio es obligatorio']
    },
    
    region: {
        type: String,
        required: [true, 'El region es obligatoria']
    },
    estado: {
        type: Boolean,
        default:true,
    },

  /*   numero_telefonico: {
        type: String,
        required: [true, 'El numero telefonico es obligatorio']
    },  */
    
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

PersonaSchema.methods.toJSON = function() {
    const { __v, ...persona  } = this.toObject();
    return persona;
}
module.exports = model('Persona', PersonaSchema);