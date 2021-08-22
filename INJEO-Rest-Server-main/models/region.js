const { Schema, model } = require('mongoose');

const RegionSchema = Schema({
    rol: {
        type: String,
        required: [true, 'La Región es obligatoria']
    }
});


module.exports = model( 'Regione', RegionSchema );
