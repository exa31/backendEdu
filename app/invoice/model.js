const { model, Schema } = require('mongoose');

const invoiceSchema = Schema({
    sub_total: {
        type: Number,
        required: [true, 'Sub total is required']
    },
    delivery_fee: {
        type: Number,
        required: [true, 'Delivery fee is required']
    },
    total: {
        type: Number,
        required: [true, 'Total is required']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    metode_payment: {
        type: String,
        enum: ['transfer', 'tunai'],
    },
    delivery_address: {
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
    },
    payment_status: {
        type: String,
        enum: ['waiting payment', 'paid'],
        default: 'waiting payment'
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }
}, { timestamps: true });

module.exports = model('Invoice', invoiceSchema);