var express = require('express');
var router = express.Router();

let firebaseAuthController = require('../controllers/firebaseAuth');

router.post('/create', firebaseAuthController.signup);

module.exports = router;
