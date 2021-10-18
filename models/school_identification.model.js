const { Schema, model } = require('mongoose');
const identifierSchema = new Schema({
    identification_number: {
        type: Number,
        required: true
    }
});

module.exports = model("IdentificationNumber", identifierSchema);