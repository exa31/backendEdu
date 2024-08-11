const Product = require('../product/model');
const CartItem = require('../cartItem/model');

// const update = async (req, res, next) => {
//     try {
//         const { items } = req.body;
//         console.log(items);
//         const productIds = items.map(item => item.product);
//         const products = await Product.find({ _id: { $in: productIds } });
//         const cartItems = items.map(item => {
//             const relatedProduct = products.find(product => product._id.toString() === item.product._id);
//             return {
//                 product: relatedProduct._id,
//                 name: relatedProduct.name,
//                 qty: item.qty,
//                 price: relatedProduct.price,
//                 image_url: relatedProduct.image_url,
//                 user: req.user._id
//             }
//         });
//         await CartItem.deleteMany({ user: req.user._id });
//         await CartItem.bulkwrite(cartItems.map(item => {
//             return {
//                 updateOne: {
//                     filter: {
//                         user: req.user._id,
//                         product: item.product
//                     },
//                     update: item,
//                     upsert: true // kalo data belum ada, maka akan dibuatkan baru
//                 }
//             }
//         }));

//         return res.json({
//             message: 'Keranjang belanja berhasil diupdate',
//             cart: cartItems
//         });
//     } catch (error) {
//         if (error.name === 'ValidationError') {
//             return res.json({
//                 error: 1,
//                 message: error.message,
//                 fields: error.errors
//             })
//         }
//         next(error);
//     }
// }

const addCart = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const cart = await CartItem.findOne({ user: req.user._id });
        const existingItem = cart.items.some(item => {
            return item.product.toString() === productId
        });
        if (existingItem) {
            const updateCart = await CartItem.findOneAndUpdate(
                {
                    user: req.user._id,
                    // jadi ini akan memfilter item yang product id nya sama dengan product id yang dikirim
                    'items.product': productId
                },
                {
                    $inc: {
                        // jadi ini akan memfilter item yang product id nya sama dengan product id yang dikirim
                        // dan difilter dari diatas jadi dia akan mengupdate qty dari item tersebut
                        'items.$.qty': 1
                    }
                },
                { new: true }
            ).populate('items.product');
            return res.json(updateCart);
        } else {
            const updateCart = await CartItem.findOneAndUpdate(
                { user: req.user._id },
                {
                    $push: {
                        items: {
                            product: productId,
                            qty: 1
                        }
                    }
                },
                { new: true }
            ).populate('items.product');

            return res.json(updateCart);
        }
        // }
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

const reduceCart = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const cart = await CartItem.findOne({ user: req.user._id });
        const qty0 = cart.items.some(item => item.qty === 1);
        if (qty0) {
            const updateCart = await CartItem.findOneAndUpdate(
                {
                    user: req.user._id,
                    'items.product': productId
                },
                {
                    $pull: {
                        items: {
                            product: productId
                        }
                    }
                },
                { new: true }
            ).populate('items.product');
            return res.json(updateCart);

        }
        const updateCart = await CartItem.findOneAndUpdate(
            {
                user: req.user._id,
                'items.product': productId
            },
            {
                $inc: {
                    'items.$.qty': -1
                }
            },
            { new: true }
        ).populate('items.product');
        return res.json(updateCart);
    } catch (error) {
        next(error);
    }
}

const removeItem = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const updateCart = await CartItem.findOneAndUpdate(
            {
                user: req.user._id,
                'items.product': productId
            },
            {
                $pull: {
                    items: {
                        product: productId
                    }
                }
            },
            { new: true }
        ).populate('items.product');
        return res.json(updateCart);
    } catch (error) {
        next(error);
    }
}

const index = async (req, res, next) => {
    try {
        const cart = await CartItem.findOne({ user: req.user._id }).populate('items.product');
        return res.json(cart);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    addCart,
    index,
    reduceCart,
    removeItem
}