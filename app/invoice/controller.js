const { subject } = require('@casl/ability');
const Invoice = require('./model');
const { policyFor } = require('../../utils');

const show = async (req, res, next) => {
    try {
        const { order_id } = req.params;
        const invoice = await Invoice.findOne({ order: order_id }).populate('order').populate('user').populate('delivery_address');
        const police = policyFor(req.user);
        const subjectInvoice = subject('Invoices', { user_id: invoice.user.id });
        if (!police.can('read', subjectInvoice)) {
            return res.json({
                error: 1,
                message: `You're not allowed to see this invoice`
            });
        }
        return res.json(invoice);
    } catch (error) {
        next(error);
    }
}

const index = async (req, res, next) => {
    try {
        const user = req.user;
        const invoices = await Invoice.find({ user: user._id }).populate('user')
            .populate('delivery_address')
            .populate({
                path: 'order',
                populate: {
                    path: 'orderItems',
                    populate: {
                        path: 'product'
                    }
                }
            });
        return res.json(invoices);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    show,
    index
}