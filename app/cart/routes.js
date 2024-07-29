const router = require('express').Router();
const { police_check } = require('../../middlewares');
const cartController = require('./controller');

router.get('/carts',
    police_check('read', 'CartItem'),
    cartController.index);
router.put('/carts',
    police_check('update', 'CartItem'),
    cartController.update);

module.exports = router;