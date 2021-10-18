const express = require('express'); // to control the flow in nodejs
// const body_parser = require('body-parser'); // to parse the requests
const mongoose = require('mongoose'); // to connect with mongoDB
const cors = require('cors'); // to handle the middlewares
const consola = require('consola'); // to show banners in console
const passport = require('passport'); // authentication middleware

const student_app = express();
const school_app = express();

student_app.set("view engine", "ejs");
school_app.set("view engine", "ejs");

//bring the constants from env
const { URL, STUDENT_PORT, SCHOOL_PORT } = require('./config');

// Middlewares
student_app.use(cors());
student_app.use(express.urlencoded({ extended: true }));
student_app.use(express.json());

school_app.use(cors());
school_app.use(express.urlencoded({ extended: true }));
school_app.use(express.json());
// app.use(body_parser.urlencoded({ extended: true }));

student_app.get("/", (req, res) => {
    res.render('pages/students/student_index');
});
school_app.get("/", (req, res) => {
    res.render('pages/schools/school_index');
});
//user middle ware
student_app.use('/students', require('./routes/student.routes'));
school_app.use('/schools', require('./routes/school.routes'));

//connect to DB and start the app
const start_app = async() => {
    try {
        // connect with DB
        await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true });

        // show successful connection message
        consola.success({
            message: `Successfully connected to DB @ ${URL}`,
            success: true,
            badge: true
        });

        //listen to the port
        student_app.listen(STUDENT_PORT, () => {
            consola.success({
                message: `Successfully listening to Student Port @ ${STUDENT_PORT}`,
                success: true,
                badge: true
            });
        });

        school_app.listen(SCHOOL_PORT, () => {
            consola.success({
                message: `Successfully listening to School Port @ ${SCHOOL_PORT}`,
                success: true,
                badge: true
            });
        });

    } catch (error) {
        consola.error({
            message: error,
            success: false
        });

        // retry connection to DB
        start_app();
    }
};

start_app();