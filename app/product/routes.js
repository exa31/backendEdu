const router = require('express').Router();
const multer = require('multer');
const os = require('os');

const productController = require('./controller');
const { police_check } = require('../../middlewares');

router.get('/products', productController.index);
//os jadi akan menyesuaikan dengan sistem operasi yang digunakan, dan tmpdir akan mengarahkan ke direktori temporary yang ada di sistem operasi tersebut.

router.post('/products',
    multer({ dest: os.tmpdir() }).single('image'),
    police_check('create', 'Product'),
    productController.store);

router.put('/products/:id',
    multer({ dest: os.tmpdir() }).single('image'),
    police_check('update', 'Product'),
    productController.update);

router.delete('/products/:id',
    police_check('delete', 'Product'),
    productController.destroy);

module.exports = router;