let UserModel = require('../models/users');

module.exports.create = async function (req, res, next) {
    try {
        console.log(req.body);
        let newUser = new UserModel(req.body);

        let result = await UserModel.create(newUser);
        res.json(
            {
                success: true,
                message: 'User created successfully.'
            }
        )
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.list = async function (req, res, next) {
    try {
        let list = await UserModel.find({}, '-password');

        res.json(list);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.userGet = async function (req, res, next) {
    try {
        let uID = req.params.userID;

        let user = await UserModel.findOne({ _id: uID }, '-hashed_password -salt');
        console.log(user);
        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        next(error);
    }

}

module.exports.userByID = async function (req, res, next) {
    res.json(req.user);
}

module.exports.update = async function (req, res, next) {
    try {
        let uID = req.params.userID;

        let updateUser = new UserModel(req.body);
        updateUser._id = uID;

        let result = await UserModel.updateOne({ _id: uID }, updateUser);
        console.log(result);

        if (result.modifiedCount > 0) {
            res.json(
                {
                    success: true,
                    message: 'User updated successfully.'
                }
            );
        } else {
            // Express will catch this on its own.
            throw new Error('User not updated. Are you sure it exists?')
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.remove = async function (req, res, next) {
    try {
        let uID = req.params.userID;

        let result = await UserModel.deleteOne({ _id: uID });
        console.log(result);

        if (result.deletedCount > 0) {
            res.json(
                {
                    success: true,
                    message: 'User deleted successfully.'
                }
            );
        } else {
            // Express will catch this on its own.
            throw new Error('User not deleted. Are you sure it exists?')
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}


module.exports.setAdmin = async function (req, res, next) {

    try {
        // Check if the current user is admin. Only admins can set another admin.
        let authorized = await UserModel.findOne({ _id: req.auth.id }, 'admin');
        console.log("authorized", authorized.admin);

        if (!authorized.admin) {
            return res.status('403').json(
                {
                    success: false,
                    message: "User is not authorized"
                }
            )
        }
        else
        {
            // Update one single field.
            let result = await UserModel.updateOne({ _id: req.params.userID }, {admin : true});
            console.log("setAdmin", result);
            if (result.modifiedCount > 0) {
                res.json(
                    {
                        success: true,
                        message: "User promoted successfully."
                    }
                );
            }
            else {
                // Express will catch this on its own.
                throw new Error('User not updated. Are you sure it exists?')
            }
        }
    } catch (error) {
        console.log(error);
        next(error)
    }

}
