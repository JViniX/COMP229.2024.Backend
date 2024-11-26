let mongoose = require('mongoose');

let inventoryModel = mongoose.Schema(
    {
        item: String,
        qty: Number,
        tags: [],
        status: String,
        size: {
            h: Number,
            w: Number,
            uom: String
        },
        owner: String
    },
    {
        collection: "inventory"
    }
);

// Ensure virtual fields are serialised.
inventoryModel.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});

module.exports = mongoose.model("Inventory", inventoryModel);