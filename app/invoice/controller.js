const { subject } = require('@casl/ability');
const Invoice = require('./model');
const { policyFor } = require('../../utils');

const show = async (req, res, next) => {
    try {
        const { order_id } = req.params;
        const invoice = await Invoice.findOne({ order: order_id }).populate('order').populate('user');
        const police = policyFor(req.user);
        const subjectInvoice = subject('Invoice', { user_id: invoice.user._id });
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

module.exports = {
    show
}