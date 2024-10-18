let UserModel = require('../models/users');


module.exports.create = async function (req, res, next) {
    try {
        console.log(req.body);
        let newUser = new UserModel(req.body);
        console.log(newUser);

        let result = await UserModel.create(newUser);
        console.log(result);
        res.json(
            {
                status: 'Ok',
                message: 'User created successfully.'
            }
        )
    } catch (error) {
        console.log(error);
        next(error);
    }
}