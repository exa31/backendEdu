const { Schema, model } = require('mongoose');

const deliveryAddressSchema = new Schema({
    name: {
        type: String,
        maxlength: [255, 'Panjang nama alamat maksimal 255 karakter'],
        minlength: [3, 'Panjang nama alamat minimal 3 karakter'],
        required: [true, 'Nama alamat harus diisi']
    },
    kelurahan: {
        type: String,
        maxlength: [255, 'Panjang nama kelurahan maksimal 255 karakter'],
        required: [true, 'Nama kelurahan harus diisi']
    },
    kecamatan: {
        type: String,
        maxlength: [255, 'Panjang nama kecamatan maksimal 255 karakter'],
        required: [true, 'Nama kecamatan harus diisi']
    },
    kabupaten: {
        type: String,
        maxlength: [255, 'Panjang nama kabupaten maksimal 255 karakter'],
        required: [true, 'Nama kabupaten harus diisi']
    },
    provinsi: {
        type: String,
        maxlength: [255, 'Panjang nama provinsi maksimal 255 karakter'],
        required: [true, 'Nama provinsi harus diisi']
    },
    detail: {
        type: String,
        maxlength: [1000, 'Panjang detail alamat maksimal 1000 karakter'],
        required: [true, 'Detail alamat harus diisi']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});


module.exports = model('DeliveryAddress', deliveryAddressSchema);