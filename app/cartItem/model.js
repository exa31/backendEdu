const { model, Schema } = require('mongoose');
const _ = require('mongoose-sequence');

const cartItemSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [{
        _id: false,
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        qty: {
            type: Number,
            default: 1
        }
    }]
})

module.exports = model('CartItem', cartItemSchema);