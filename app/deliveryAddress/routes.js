const router = require('express').Router();
const { police_check } = require('../../middlewares');
const deliveryAddressController = require('./controller');

router.get('/delivery-addresses',
    police_check('read', 'DeliveryAddress'),
    deliveryAddressController.index);
router.post('/delivery-addresses',
    police_check('create', 'DeliveryAddress'),
    deliveryAddressController.store);
router.put('/delivery-addresses/:id', deliveryAddressController.update);
router.delete('/delivery-addresses/:id',
    police_check('delete', 'DeliveryAddress'),
    deliveryAddressController.destroy);

module.exports = router