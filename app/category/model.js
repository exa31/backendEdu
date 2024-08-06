const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        enum: ['Makanan', 'Minuman'],
        required: [true, 'Nama kategori harus diisi']
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }]
});

module.exports = model('Category', categorySchema);