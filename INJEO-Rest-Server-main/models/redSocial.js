const { Schema, model } = require('mongoose');


const RedesSocialeSchema = Schema({
    red: {
        type: String,
        required: [true, 'El nombre es obligatorio']
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


RedesSocialeSchema.methods.toJSON = function () {
    const {__v, ...data} = this.toObject();
    return data;
}

module.exports = model('RedesSociale', RedesSocialeSchema);



