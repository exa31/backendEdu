const router = require('express').Router();
const { police_check } = require('../../middlewares');
const cartController = require('./controller');

router.get('/carts',
    police_check('read', 'CartItem'),
    cartController.index);
router.put('/carts/add',
    police_check('update', 'CartItem'),
    cartController.addCart);
router.put('/carts/reduce',
    police_check('update', 'CartItem'),
    cartController.reduceCart);
router.put('/carts/remove',
    police_check('update', 'CartItem'),
    cartController.removeItem);


module.exports = router;