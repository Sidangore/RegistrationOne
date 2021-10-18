require('dotenv').config();

module.exports = {
    SECRET: process.env.SECRET,
    STUDENT_PORT: process.env.STUDENT_PORT,
    SCHOOL_PORT: process.env.SCHOOL_PORT,
    URL: process.env.URL
};