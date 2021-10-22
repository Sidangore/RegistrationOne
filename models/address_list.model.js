const { Schema, model } = require('mongoose');
const address_list_Schema = new Schema({
    public_address: {
        type: String,
        required: true
    }
});

module.exports = model("PublicAddress", address_list_Schema);