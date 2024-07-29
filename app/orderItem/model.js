const { model, Schema } = require('mongoose');

const orderItemSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name min 3 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
    },
    qty: {
        type: Number,
        required: [true, 'Kuantitas is required'],
        min: [1, 'Kuantitas min 1']
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
});

module.exports = model('OrderItem', orderItemSchema);