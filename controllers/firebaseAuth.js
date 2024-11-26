const firebase = require('firebase-admin');

module.exports.signup = function (req, res, next) {

    firebase.auth().createUser({
        displayName: req.body.displayName,
        email: req.body.email,
        password: req.body.password,
        photoURL: req.body.photoURL,
        phoneNumber: req.body.phoneNumber
    })
        .then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully created new user:', userRecord);

            return res.json(
                {
                    success: true,
                    message: 'User created successfully!'
                }
            );
        })
        .catch((error) => {
            console.log('Error creating new user:', error);

            return res.status(400).json(
                {
                    success: false,
                    message: error.message
                }
            );
        });
}

module.exports.requireSignin = function (req, res, next) {

    let token = req.header('Authorization').substr(7);

    firebase.auth().verifyIdToken(token, true)
        .then((decodedToken) => {
            console.log(decodedToken);
            req.auth = decodedToken;
            next();
        })
        .catch((error) => {
            // Handle error
            console.log(error);
            res.status(401).json({
                success: false,
                message: error.message
            });
        });

}