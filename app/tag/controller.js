const Tag = require('./model');

const index = async (req, res, next) => {
    try {
        // pemanggilannya dengan cara http://localhost:3000/api/products?limit=10&skip=0
        //pagination
        const { limit = 10, skip = 0 } = req.query;

        const tag = await Tag.find()
            .skip(parseInt(skip))
            .limit(parseInt(limit))
        return res.json(tag);
    } catch (err) {
        next(err);
    }
}

// untuk menyimpan data produk baru dengan menggunakan multer untuk file upload dan menyimpan file ke direktori public/images/products
const store = async (req, res, next) => {
    try {
        const payload = req.body;
        const tag = new Tag(payload);
        await tag.save();
        return res.json(tag);
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
}

const update = async (req, res, next) => {
    try {
        const payload = req.body;
        const { id } = req.params;
        const tag = await Tag.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
        return res.json(tag);
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }

        next(err);

    }
}

const destroy = async (req, res, next) => {
    const { id } = req.params;
    try {
        const tag = await Tag.findByIdAndDelete(id);
        return res.json({ message: 'Tag deleted', tag });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    store,
    index,
    update,
    destroy
}