const Product = require('../product/model');
const CartItem = require('../cartItem/model');

const update = async (req, res, next) => {
    try {
        const { items } = req.body;
        const productIds = items.map(item => item.product);
        const products = await Product.find({ _id: { $in: productIds } });
        const cartItems = items.map(item => {
            const relatedProduct = products.find(product => product._id.toString() === item.product._id);
            return {
                product: relatedProduct._id,
                name: relatedProduct.name,
                qty: item.qty,
                price: relatedProduct.price,
                image_url: relatedProduct.image_url,
                user: req.user._id
            }
        });
        await CartItem.deleteMany({ user: req.user._id });
        await CartItem.bulkwrite(cartItems.map(item => {
            return {
                updateOne: {
                    filter: {
                        user: req.user._id,
                        product: item.product
                    },
                    update: item,
                    upsert: true // kalo data belum ada, maka akan dibuatkan baru
                }
            }
        }));

        return res.json({
            message: 'Keranjang belanja berhasil diupdate',
            cart: cartItems
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            })
        }
        next(error);
    }
}

const index = async (req, res, next) => {
    try {
        const cart = await CartItem.find({ user: req.user._id }).populate('product');
        return res.json(cart);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    update,
    index
}