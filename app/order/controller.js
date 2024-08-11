const Order = require('./model');
const OrderItem = require('../orderItem/model');
const CartItem = require('../cartItem/model');
const DeliveryAddress = require('../deliveryAddress/model');

const store = async (req, res, next) => {
    try {
        const { delivery_address, metode_payment } = req.body;
        if (metode_payment === '') {
            return res.json({
                error: 1,
                message: 'Metode payment harus diisi'
            })
        }
        const delivery_fee = 20000;
        const items = await CartItem.findOne({ user: req.user._id }).populate('items.product');
        const address = await DeliveryAddress.findOne({ _id: delivery_address, user: req.user._id });
        const order = new Order({
            delivery_fee: delivery_fee,
            metode_payment: metode_payment,
            delivery_address: {
                kelurahan: address.kelurahan,
                kecamatan: address.kecamatan,
                kabupaten: address.kabupaten,
                provinsi: address.provinsi,
                detail: address.detail
            },
            orderItems: [],
            user: req.user._id
        })
        const orderItems = await OrderItem.insertMany(items.items.map((item) => {
            return {
                name: item.product.name,
                price: item.product.price,
                qty: item.qty,
                order: order._id,
                product: item.product._id
            }
        }))
        order.orderItems = orderItems;

        order.save();
        await CartItem.findOneAndUpdate(
            {
                user: req.user._id,
            },
            {
                $set: {
                    items: []
                }
            },)
        return res.json(order);
    } catch (error) {
        console.error('Error occurred:', error);
        if (error.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            });
        }
        next(error);
    }
}

const index = async (req, res, next) => {
    try {
        const { limit = 10, skip = 0 } = req.query;
        const count = await Order.find({ user: req.user._id }).countDocuments();
        const orders = await Order.find({ user: req.user._id })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .populate('orderItems')
            .sort({ createdAt: -1 });
        return res.json({
            data: orders,
            count,
            limit: parseInt(limit),
            skip: parseInt(skip)
        });
    } catch (error) {
        if (error && error.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findOneAndUpdate({ _id: id }, { $set: { status: 'paid' } }, { new: true });
        return res.json(order);
    } catch (error) {
        if (error && error.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            });
        }
        next(error);
    }
}


module.exports = {
    store,
    index,
    update
}