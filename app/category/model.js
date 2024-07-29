const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        minlength: [3, 'Panjang kategori minimal 3 karakter'],
        maxlength: [20, 'Panjang kategori maksimal 20 karakter'],
        required: [true, 'Nama kategori harus diisi']
    }
});

module.exports = model('Category', categorySchema);