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
        type: Schema.Types.ObjectId,
        ref: 'DeliveryAddress'
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