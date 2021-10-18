const router = require('express').Router();
const { school_registration } = require('../utils/school.auth.utils');

// REGISTRATION OF SCHOOLS
router.get('/register', async(req, res) => {
    res.render('pages/schools/school_register');
});

router.post('/register', async(req, res) => {
    await school_registration(req.body, res);
});

// LOGIN OF SCHOOLS
router.get('/login', async(req, res) => {

});

router.post('/login', async(req, res) => {

});

module.exports = router;