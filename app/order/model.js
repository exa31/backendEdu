const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Invoice = require('../invoice/model');

const orderSchema = Schema({
    status: {
        type: String,
        enum: ['waiting payment', 'paid', 'delivered', 'canceled'],
        default: 'waiting payment'
    },
    delivery_fee: {
        type: Number,
        default: 0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    delivery_address: {
        type: Schema.Types.ObjectId,
        ref: 'DeliveryAddress'
    },
    metode_payment: {
        type: String,
        enum: ['transfer', 'tunai'],
    },
    orderItems: [{
        type: Schema.Types.ObjectId,
        ref: 'OrderItem'
    }]
}, { timestamps: true });

orderSchema.plugin(AutoIncrement, { inc_field: 'order_number' });
// orderSchema.virtual('items_count').get(function () {
//     return this.orderItems.reduce((total, item) => total + parseInt(item.qty), 0);
// });
orderSchema.post('save', async function () {
    this.orderItems.forEach(product => {
        console.log(product.name)

    });
    const sub_total = this.orderItems.reduce((total, item) => total + (item.price * item.qty), 0);
    const invoice = new Invoice({
        user: this.user,
        order: this._id,
        delivery_fee: this.delivery_fee,
        delivery_address: this.delivery_address,
        sub_total: sub_total,
        total: sub_total + this.delivery_fee,
        metode_payment: this.metode_payment
    });
    await invoice.save();
})

// pada middlware pre baru ditambahkan next() untuk melanjutkan ke proses selanjutnya
orderSchema.post('findOneAndUpdate', async function () {
    // this condition untuk mencari invoice berdasarkan order yg diupdate, this update untuk mendapatkan status order yg diupdate
    const invoice = await Invoice.findOneAndUpdate({ order: this._conditions._id }, { $set: { payment_status: this._update.$set.status } });
    // console.log(invoice)
    // // console.log(this._conditions)
    // console.log(this._update)
    // console.log(this._update.$set.status)
})

module.exports = model('Order', orderSchema);