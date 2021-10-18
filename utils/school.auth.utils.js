const bcryptjs = require('bcryptjs'); // to hash and decode the password
const jwt = require('jsonwebtoken'); // the jwt functionality
const School = require('../models/school.model');
const IdentificationNumber = require('../models/school_identification.model');
const { success, error } = require('consola');
const { SECRET } = require('../config');

// const passport = require('passport'); // authentication middleware functionality

// register the school to portal function
const school_registration = async(school_details, res) => {
    try {
        // validate the email for school 
        let email_taken = await validate_email(school_details.email);
        if (email_taken) {
            return res.status(400).json({
                message: `Email alredy registered`,
                success: false
            });
        }

        //validate the identification number
        let identification_number_not_present = await validate_identification_number(school_details.identification_number);
        if (!identification_number_not_present) {
            return res.status(400).json({
                message: `Identification Number not Registered or Already Registered`,
                success: false
            });
        }

        // if it passes the email and aadhar validation the hash the password
        const password = await bcryptjs.hash(school_details.password, 12);

        // create the new student
        const new_school = new School({
            ...school_details,
            password
        });

        //save the new student
        await new_school.save();

        // return res.status(200).json({
        //     message: `Student is now registerd!`,
        //     success: true
        // });
        success({
            message: "A School registered successfully!",
            badge: true
        });
        return res.redirect('/');
    } catch (error) {
        return res.status(500).json({
            message: `Unable to create account because of : ${error}`,
            success: false
        });
    }
};

// student login function 
const school_login = async(school_details, res) => {
    try {
        // check for the email in DB
        const school_is_present = await validate_email(school_details.email);

        if (!school_is_present) {
            return res.status(404).json({
                message: `Email not found!`,
                success: false
            });
        }

        const school = await School.findOne({
            email: school_details.email
        });

        // if (school.role !== "student") {
        //     return res.status(403).json({
        //         message: `This email is not for student access`,
        //         success: false
        //     });
        // }

        // now the school is valid therefore check the password
        let password_is_correct = await bcryptjs.compare(school_details.password, school.password);

        if (password_is_correct) {
            //sign the token and issue it to the student
            let token = jwt.sign({
                school_id: school._id,
                email: school.email,
                identification_number: school.identification_number
            }, SECRET, {
                expiresIn: "7 days"
            });

            let result = {
                email: school.email,
                token: `Bearer ${token}`,
                expiresIn: 168
            }

            return res.status(200).json({
                ...result,
                message: `You are logged in as ${school.email}`,
                success: true
            });
        }
    } catch (error) {
        return res.status(403).json({
            message: `Incorrect Password with Error : ${error}`,
            success: false
        });
    }
};

//validate the identification number
const validate_identification_number = async(identification_number) => {
    let num = await IdentificationNumber.findOne({
        identification_number
    });
    let taken = await School.findOne({
        identification_number
    });
    // console.log(student);
    if (taken) {
        return false;
    }
    return num ? true : false;
};

//validate the email
const validate_email = async(email) => {
    let school = await School.findOne({
        email
    });
    return school ? true : false;
};
module.exports = {
    school_registration,
    school_login
};