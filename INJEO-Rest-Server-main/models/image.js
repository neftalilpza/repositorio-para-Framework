const { Schema, model}= require('mongoose');

const ImageSchema = Schema({
   
    img: {
        type: String,      
    },
/* 
    titulo: {
        type: String,
    },  
 */
    estado: {
        type: Boolean,
        required: true,
        default:true,
       
    },

    usuario_id: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required:true,        
    },

    fecha_registro: {
        type:  Date,
            
    },

    fecha_eliminacion: {
        type:  Date,
            
    },
});



ImageSchema.methods.toJSON = function () {
    const {__v, estado, ...data }=this.toObject();
    return data;
}

module.exports= model('Image', ImageSchema);








