const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Invoice = require('../invoice/model');

const orderSchema = Schema({
    status: {
        type: String,
        enum: ['waiting_payment', 'paid', 'delivered', 'canceled'],
        default: 'waiting_payment'
    },
    delifery_fee: {
        type: Number,
        default: 0
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
    orderItems: [{
        type: Schema.Types.ObjectId,
        ref: 'OrderItem'
    }]
}, { timestamps: true });

orderSchema.plugin(AutoIncrement, { inc_field: 'order_number' });
orderSchema.virtual('items_count').get(function () {
    return this.orderItems.reduce((total, item) => total + parseInt(item.qty), 0);
});
orderSchema.post('save', async function () {
    const sub_total = this.orderItems.reduce((total, item) => total + (item.price * item.qty), 0);
    const invoice = new Invoice({
        user: this.user,
        order: this._id,
        delivery_fee: this.delifery_fee,
        delivery_address: this.delivery_address,
        sub_total: sub_total,
        total: sub_total + this.delifery_fee
    });
    await invoice.save();
})

module.exports = model('Order', orderSchema);