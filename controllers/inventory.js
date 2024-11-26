let InventoryModel = require('../models/inventory');
let UserModel = require('../models/users');

module.exports.invetoryList = async function (req, res, next) {

    try {
        let list = await InventoryModel.find({}).populate('owner');
        res.json(list);
    } catch (error) {
        console.log(error);
        next(error);
    }

}

module.exports.getByID = async function (req, res, next) {
    try {
        let item = await InventoryModel.findOne({ _id: req.params.id });
        if (!item)
            throw new Error('Item not found. Are you sure it exists?')

        res.json(item);

    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.processAdd = async (req, res, next) => {
    try {
        console.log("req.payload: ", req.auth);
        let newProduct = InventoryModel({
            item: req.body.item,
            qty: req.body.qty,
            status: req.body.status,
            size: {
                h: req.body.size.h,
                w: req.body.size.w,
                uom: req.body.size.uom
            },
            tags: req.body.tags.split(",").map(word => word.trim()),
            owner: (req.body.owner == null || req.body.owner == "")? req.auth.uid : req.body.owner
        });

        let result = await InventoryModel.create(newProduct)

        // refresh the book list
        console.log(result);
        res.json(result);

    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.processEdit = async (req, res, next) => {
    try {

        let id = req.params.id;

        // Builds updatedProduct from the values of the body of the request.
        let updatedProduct = InventoryModel({
            _id: req.params.id,
            item: req.body.item,
            qty: req.body.qty,
            status: req.body.status,
            size: {
                h: req.body.size.h,
                w: req.body.size.w,
                uom: req.body.size.uom
            },
            tags: req.body.tags.split(",").map(word => word.trim()),
            owner: (req.body.owner == null || req.body.owner == "")? req.auth.uid : req.body.owner
        });

        // Submits updatedProduct to the DB and waits for a result.
        let result = await InventoryModel.updateOne({ _id: id }, updatedProduct);
        console.log(result);

        // If the product is updated redirects to the list
        if (result.modifiedCount > 0) {
            res.json(
                {
                    success: true,
                    message: "Item updated sucessfully."
                }
            );
        }
        else {
            // Express will catch this on its own.
            throw new Error('Item not udated. Are you sure it exists?')
        }

    } catch (error) {
        next(error)
    }
}


module.exports.performDelete = async (req, res, next) => {

    try {

        let id = req.params.id;

        let result = await InventoryModel.deleteOne({ _id: id });

        console.log("====> Result: ", result);
        if (result.deletedCount > 0) {
            // refresh the book list
            res.json(
                {
                    success: true,
                    message: "Item deleted sucessfully."
                }
            )
        }
        else {
            // Express will catch this on its own.
            throw new Error('Item not deleted. Are you sure it exists?')
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.hasAuthorization = async function(req, res, next){

    try {
        let id = req.params.id
        let inventoryItem = await InventoryModel.findById(id);
        console.log(inventoryItem);

        // If there is no item found.
        if (inventoryItem == null) {
            throw new Error('Item not found.') // Express will catch this on its own.
        }
        else if (inventoryItem.owner != null) { // If the item found has a owner.

            if (inventoryItem.owner != req.auth.uid) { // If the owner differs.
  
                console.log('====> Not authorized');
                return res.status(403).json(
                    {
                        success: false,
                        message: 'User is not authorized to modify this item.'
                    }
                );
                
            }
        }

        // If it reaches this point, runs the next middleware.
        next();
    } catch (error) {
        console.log(error);   
        next(error);
    }
}