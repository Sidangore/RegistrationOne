const { Schema, model } = require('mongoose');

const schoolSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    identification_number: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    year_of_establishment: {
        type: Number,
        required: true
    },
    affiliaion: {
        type: String,
        required: true,
        default: "CBSE",
        enum: ["CBSE", "State", "ICSE", "CISCE", "NIOS", "IB", "CIE"]
    },
    type: {
        type: String,
        required: true,
        default: "Private",
        enum: ["Government", "Aided", "Private", "National", "International", "Home"]
    },
    seats_available: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = model("School", schoolSchema);