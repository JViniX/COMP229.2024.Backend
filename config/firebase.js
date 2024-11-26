require('dotenv').config();
var admin = require("firebase-admin");

module.exports = function(){

    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.GCLOUD_SERVICE_KEY))
    });

    console.log('====> Connected to Firebase.');
}