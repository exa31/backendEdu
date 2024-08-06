const router = require('express').Router();
const orderController = require('./controller');
const { police_check } = require('../../middlewares');

router.post('/order',
    police_check('create', 'Order'),
    orderController.store);

router.get('/order',
    police_check('read', 'Order'),
    orderController.index);

router.put('/order/:id',
    police_check('update', 'Order'),
    orderController.update);


module.exports = router;