const { subject } = require('@casl/ability');
const DeliveryAddress = require('./model');
const policyFor = require('../../utils').policyFor;

const show = async (req, res, next) => {
    try {
        const user = req.user;
        const deliveryAddress = await DeliveryAddress.find({ user: user._id });
        if (deliveryAddress.length === 0) {
            return res.json({
                error: 1,
                statusCode: 404,
                message: 'Delivery address not found'
            });
        }
        return res.json(deliveryAddress);
    } catch (err) {
        next(err);
    }
}

const showOne = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deliveryAddress = await DeliveryAddress.findOne({ _id: id });
        if (!deliveryAddress) {
            return res.json({
                error: 1,
                statusCode: 404,
                message: 'Delivery address not found'
            });
        }
        return res.json(deliveryAddress);
    } catch (err) {
        next(err);
    }
}

const store = async (req, res, next) => {
    try {
        const deliveryAddress = new DeliveryAddress(req.body);
        const user = req.user
        deliveryAddress.user = user._id; // user._id dari middleware decodeToken dan harus _id karena bukan dari mongoose
        await deliveryAddress.save();
        return res.json({
            success: 1,
            statusCode: 201,
            message: 'Delivery address saved',
            data: deliveryAddress
        });
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
};

const update = async (req, res, next) => {
    const police = policyFor(req.user);
    try {
        const { id } = req.params;
        const address = await DeliveryAddress.findOne({ _id: id });
        const subjectAddress = subject('DeliveryAddress', { user_id: address.user });
        if (!police.can('update', subjectAddress)) {
            return res.json({
                error: 1,
                message: `You're not allowed to update address`
            });
        } else {
            const deliveryAddress = await DeliveryAddress.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true });
            return res.json({
                statusCode: 200,
                deliveryAddress
            });
        }
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
}

const destroy = async (req, res, next) => {
    const police = policyFor(req.user);
    try {
        const { id } = req.params;
        const address = await DeliveryAddress.findOne({ _id: id });
        const subjectAddress = subject('DeliveryAddress', { user_id: address.user });
        if (!police.can('delete', subjectAddress)) {
            return res.json({
                error: 1,
                message: `You're not allowed to delete address`
            });
        } else {
            const deliveryAddress = await DeliveryAddress.findOneAndDelete({ _id: id }, req.body, { new: true, runValidators: true });
            return res.json(deliveryAddress);
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    store,
    update,
    show,
    showOne,
    destroy
}