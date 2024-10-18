var express = require('express');
var router = express.Router();

let usersController = require('../controllers/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/create', usersController.create);

module.exports = router;
