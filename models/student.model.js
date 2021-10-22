const { Schema, model } = require('mongoose');
const studentSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    public_address: {
        type: String,
        required: true
    },
    nonce: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        default: "student"
    },
    aadhar_number: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model("Student", studentSchema);