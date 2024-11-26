var express = require('express');
var router = express.Router();

let usersController = require('../controllers/users');
let authController = require('../controllers/auth');

router.post('/signin', authController.signin);
router.get('/list', usersController.list);
router.post('/create', usersController.create);
router.get('/get/:userID', usersController.userGet, usersController.userByID);
router.put('/edit/:userID', usersController.update);
router.delete('/delete/:userID', usersController.remove);

router.put('/setadmin/:userID', 
  authController.requireSignin, 
  usersController.setAdmin);

module.exports = router;
