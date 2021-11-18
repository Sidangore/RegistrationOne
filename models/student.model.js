const { Schema, model } = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');

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
    },
    verified: {
        type: Boolean,
        default: false
    },
    // verification_token: {
    //     type: String,
    //     required: false
    // },
    // reset_password_token: {
    //     type: String,
    //     required: false
    // },
    // reset_password_expires_in: {
    //     type: Date,
    //     required: false
    // }
}, {
    timestamps: true
});

// studentSchema.pre("save", async function(name) {
//     let student = this;
//     if (!student.isModified("password")) return next;
//     student.password = await bcryptjs.hash(student.password, 12);
//     next();
// });

// studentSchema.methods.compare_passwords = async function(password) {
//     return await bcryptjs.compare(password, this.password);
// };

// studentSchema.methods.generate_jwt = async function() {
//     let payload = {
//         id: this._id,
//         role: this.role,
//         email: this.email,
//         aadhar_number: this.aadhar_number
//     }
//     return await jwt.sign(payload, SECRET, { expiresIn: "7 day" });
// };

module.exports = model("Student", studentSchema);