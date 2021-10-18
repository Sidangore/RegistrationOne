const router = require('express').Router();
const {
    student_registration,
    student_login
} = require('../utils/student.auth.utils');

// GET Login
router.get('/login', async(req, res) => {
    res.render('pages/students/student_login');
});
// POST Login
router.post('/login', async(req, res) => {
    // console.log(req.body);
    await student_login(req.body, res);
});

// GET signup
router.get('/register', async(req, res) => {
    res.render('pages/students/student_register');
});
// POST Register
router.post('/register', async(req, res) => {
    // console.log(req.body);
    await student_registration(req.body, res);
    // res.redirect('pages/index');
});


module.exports = router;