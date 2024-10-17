var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('Hello from the root of Products Router');
});

router.get('/laptop', function (req, res, next) {
    res.send('This is the laptop endpoint.');
});

module.exports = router;