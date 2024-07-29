const { model, Schema } = require('mongoose');

const cartItemSchema = Schema({
    name: {
        type: String,
        required: [true, 'Nama produk harus diisi']
    },
    qty: {
        type: Number,
        required: [true, 'Jumlah produk harus diisi'],
        min: [1, 'Minimal jumlah produk adalah 1']
    },
    price: {
        type: Number,
        default: 0
    },
    image_url: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
})

module.exports = model('CartItem', cartItemSchema);