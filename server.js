const express = require('express'); // to control the flow in nodejs
// const body_parser = require('body-parser'); // to parse the requests
const mongoose = require('mongoose'); // to connect with mongoDB
const cors = require('cors'); // to handle the middlewares
const consola = require('consola'); // to show banners in console
const passport = require('passport'); // authentication middleware

const app = express();
app.set("view engine", "ejs");

//bring the constants from env
const { URL, PORT } = require('./config');

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(body_parser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render('pages/index');
});
//user middle ware
app.use('/students', require('./routes/student.routes'));

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
        app.listen(PORT, () => {
            consola.success({
                message: `Successfully listening to Port @ ${PORT}`,
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