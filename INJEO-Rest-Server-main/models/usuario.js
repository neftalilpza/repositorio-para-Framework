
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
/*     nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    }, */
    /* apellido_paterno: {
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
 */


    user_name: {
        type: String,
        // required: [true, 'El nombre es obligatorio']
    },

    numero_telefonico: {
        type: String,
        required: [true, 'El numero telefonico es obligatorio']
    }, 

 
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        // unique: false
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        // emun: ['ADMIN_ROLE', 'USER_ROLE']
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
    datos_completos:{
        type: Boolean,
        default:false,
    }
    
/*     google: {
        type: Boolean,
        default: false
    }, */
});



UsuarioSchema.methods.toJSON = function() {
    const { __v, password, ...usuario  } = this.toObject();
    return usuario;
}

module.exports = model( 'Usuario', UsuarioSchema );
