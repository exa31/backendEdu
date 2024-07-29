const Order = require('./model');
const OrderItem = require('../orderItem/model');
const cartItem = require('../cartItem/model');
const { Types } = require('mongoose');
const DeliveryAddress = require('../deliveryAddress/model');

const store = async (req, res, next) => {
    try {
        const { delivery_address, delivery_fee } = req.body;
        const items = await cartItem.find({ user: req.user._id }).populate('product');
        if (!item.length) {
            return res.json({
                error: 1,
                message: 'Cart is empty'
            });
        }
        const address = await DeliveryAddress.findOne({ _id: delivery_address, user: req.user._id });
        if (!address) {
            return res.json({
                error: 1,
                message: 'Address not found'
            });
        }
        const order = new Order({
            _id: new Types.ObjectId(),
            status: 'waiting_payment',
            delivery_fee: delivery_fee,
            delivery_address: {
                provinsi: address.provinsi,
                kabupaten: address.kabupaten,
                kecamatan: address.kecamatan,
                kelurahan: address.kelurahan,
                detail: address.detail
            },
            user: req.user._id
        })
        const orderItems = await OrderItem.insertMany(items.map(item => ({
            ...item,
            name: item.product.name,
            price: parseInt(item.product.price),
            qty: parseInt(item.qty),
            order: order._id,
            product: item.product._id
        })));
        orderItems.forEach(item => {
            order.orderItems.push(item._id);
        });
        order.save();
        await cartItem.deleteMany({ user: req.user._id });
        return res.json(order);
    } catch (error) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
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
            .sort(-createdAt);
        return res.json({
            data: orders,
            count,
            limit: parseInt(limit),
            skip: parseInt(skip)
        });
    } catch (error) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(error);
    }
};


module.exports = {
    store,
    index
}