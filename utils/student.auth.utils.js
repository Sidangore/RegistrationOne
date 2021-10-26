const bcryptjs = require('bcryptjs'); // to hash and decode the password
const jwt = require('jsonwebtoken'); // the jwt functionality
const Student = require('../models/student.model');
const { success, error } = require('consola');
const { SECRET } = require('../config');
const net = require('net');

const Web3 = require('web3');

const web3 = new Web3('HTTP://127.0.0.1:7545');
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
// const web3 = new Web3('https://ropsten.infura.io/v3/1815651cbc7440fca737ecf87905dd31');
// const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/1815651cbc7440fca737ecf87905dd31"));
// const web3 = new Web3(new Web3.providers.IpcProvider("HTTP://127.0.0.1:7545", net));

const PublicAddress = require('../models/address_list.model');

// const passport = require('passport'); // authentication middleware functionality

// register the user to portal function
const student_registration = async(student_details, res) => {
    try {
        //validate the public address
        let public_address_taken = await validate_public_address(student_details.public_address);
        if (public_address_taken) {
            return res.status(400).json({
                message: `Address already in use`,
                success: false
            });
        }
        // validate the aadhar
        let aadhar_number_taken = await validate_aadhar_number(student_details.aadhar_number);
        if (aadhar_number_taken) {
            return res.status(400).json({
                message: `Aadhar already registered`,
                success: false
            });
        }

        //validate the email 
        let email_taken = await validate_email(student_details.email);
        if (email_taken) {
            return res.status(400).json({
                message: `Email alredy registered`,
                success: false
            });
        }

        // if it passes the email and aadhar validation the hash the password
        const password = await bcryptjs.hash(student_details.password, 12);

        const nonce = 12345;

        // create the new student
        const new_student = new Student({
            ...student_details,
            password: password,
            nonce: nonce
        });

        //save the new student
        await new_student.save();

        //save the new students address to public_address_DB
        await new PublicAddress({
            public_address: student_details.public_address
        }).save();

        // return res.status(200).json({
        //     message: `Student is now registerd!`,
        //     success: true
        // });

        //display the success message
        success({
            message: "A Student registered successfully!",
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
const student_login = async(student_details, res) => {
    try {
        // check for the email in DB
        const student_is_present = await validate_email(student_details.email);

        if (!student_is_present) {
            return res.status(404).json({
                message: `Email not found!`,
                success: false
            });
        }

        const student = await Student.findOne({
            email: student_details.email
        });

        if (student.role !== "student") {
            return res.status(403).json({
                message: `This email is not for student access`,
                success: false
            });
        }

        //check the ethereum address used
        const correct_public_address = await validate_public_address(student.public_address);
        if (!correct_public_address) {
            return res.status(403).json({
                message: `This Public Address is not Associated with the Student `,
                success: false
            });
        }

        // now the student is valid therefore check the password
        let password_is_correct = await bcryptjs.compare(student_details.password, student.password);

        if (password_is_correct) {
            //sign the token and issue it to the student
            let token = jwt.sign({
                student_id: student._id,
                role: student.role,
                email: student.email,
                aadhar_number: student.aadhar_number
            }, SECRET, {
                expiresIn: "7 days"
            });

            //sign the metamask message to authenticate self
            // web3.eth.personal.sign('12345', student.public_address, (error, signature) => {
            //     if (error) {
            //         console.log(error);
            //         return;
            //     }
            //     console.log(student.public_address, signature);
            // });

            //working
            await web3.eth.getBalance(student.public_address, function(err, result) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(web3.utils.fromWei(result, "ether") + " ETH")
                }
            });
            // console.log('WEB3###');
            // console.log(await web3.eth.personal.sign);

            let result = {
                email: student.email,
                role: student.role,
                token: `Bearer ${token}`,
                expiresIn: 168
            }

            return res.status(200).json({
                ...result,
                message: `You are logged in as ${student.email}`,
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

//validate the aadhar number
const validate_aadhar_number = async(aadhar_number) => {
    let student = await Student.findOne({
        aadhar_number
    });
    // console.log(student);
    return student ? true : false;
};

//validate the email
const validate_email = async(email) => {
    let student = await Student.findOne({
        email
    });
    return student ? true : false;
};

//validate the public address
const validate_public_address = async(public_address) => {
    let student = await Student.findOne({
        public_address
    });
    return student ? true : false;
};

// add the public address to common DB of registered address
// const add_public_address = async(public_address) => {

// };

module.exports = {
    student_registration,
    student_login
};