const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        minlength: [3, 'Panjang nama makanan minimal 3 karakter'],
        required: true
    },
    description: {
        type: String,
        maxlength: [1000, 'Panjang deskripsi maksimal 1000 karakter'],
    },
    price: {
        type: Number,
        required: [true, 'Harga harus diisi kalo ga berarti gratis'],
        default: 0
    },
    image_url: {
        type: String,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag',
    }]
}, {
    timestamps: true, // auto generate createdAt and updatedAt
    // strict: false untuk membiarkan data yang tidak ada di schema
});

module.exports = model('Product', productSchema);