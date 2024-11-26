var express = require('express');
var router = express.Router();

let inventoryController = require('../controllers/inventory');
let authController = require('../controllers/auth');
let firebaseAuthController = require('../controllers/firebaseAuth');

/* GET list of items */
router.get('/list', inventoryController.invetoryList);

router.get('/get/:id', inventoryController.getByID);

// Routers for edit
router.put('/edit/:id', 
    firebaseAuthController.requireSignin, 
    inventoryController.hasAuthorization,
    inventoryController.processEdit);

// Delete
router.delete('/delete/:id', 
    firebaseAuthController.requireSignin, 
    inventoryController.hasAuthorization,
    inventoryController.performDelete);

/* POST Route for processing the Add page - CREATE Operation */
router.post('/add', 
    firebaseAuthController.requireSignin, 
    inventoryController.processAdd);

module.exports = router;