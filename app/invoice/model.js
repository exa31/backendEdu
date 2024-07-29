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
    delivery_address: {
        provinsi: {
            type: String,
            required: [true, 'Provinsi is required']
        },
        kabupaten: {
            type: String,
            required: [true, 'Kabupaten is required']
        },
        kecamatan: {
            type: String,
            required: [true, 'Kecamatan is required']
        },
        kelurahan: {
            type: String,
            required: [true, 'Kelurahan is required']
        },
        detail: {
            type: String,
            required: [true, 'Detail is required']
        }
    },
    payment_status: {
        type: String,
        enum: ['waiting_payment', 'paid'],
        default: 'waiting_payment'
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }
}, { timestamps: true });

module.exports = model('Invoice', invoiceSchema);