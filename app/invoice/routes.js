const router = require('express').Router();
const invoiceController = require('./controller');
const { police_check } = require('../../middlewares');

router.get('/invoices/:order_id',
    police_check('read', 'Invoices'),
    invoiceController.show);

router.get('/invoices',
    police_check('read', 'Invoices'),
    invoiceController.index);

module.exports = router;