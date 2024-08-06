const User = require('../user/model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config')
const CartItem = require('../cartItem/model');
const { getToken } = require('../../utils');

const register = async (req, res, next) => {
    try {
        const payload = req.body;
        const cart = new CartItem();
        const user = new User({ ...payload, cart: cart._id });
        cart.user = user._id;
        await user.save();
        await cart.save();
        return res.json(user);
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                statusCode: 400,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
}

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true });
        return res.json(user);
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

const localStrategy = async (email, password, done) => {
    try {                                                  // kalo dikasih - berarti ga dipakai jadi nanti isinya selain ini 
        const user = await User.findOne({ email }).select('-__v -createdAt -updatedAt -cart_items -token +password');
        //jadi select itu untuk memilih field yang akan diambil dan ini tambahan yg dibuat
        if (!user) {
            return done();
        }
        if (bcrypt.compareSync(password, user.password)) {
            //jadi ini sama seperti destructuring cuma beda cara aja ini cara langsung
            // ({ password, ...userWithoutPassword } = user.toJSON());
            //jadi disini memisahkan password dari user
            const { password, ...userWithoutPassword } = user.toJSON();
            // jadi param pertama itu error, param kedua itu data
            return done(null, userWithoutPassword);
        }
    } catch (err) {
        return done(err, null);
    }
    done();
}

const login = async (req, res, next) => {
    passport.authenticate('local', async function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            // jadi disini untuk membingungkan hacker
            return res.json({
                error: 1,
                statusCode: 401,
                message: 'email or password incorrect'
            });
        }
        const signed = jwt.sign(user, config.secretKey);
        try {
            await User.findByIdAndUpdate(user._id, { $push: { token: signed } });
            return res.json({
                message: 'logged in successfully',
                user: user,
                token: signed
            });
        } catch (err) {
            return next(err);
        }

    })(req, res, next); // ini untuk menjalankan passport.authenticate
}

const logout = async (req, res, next) => {
    try {
        const token = getToken(req);

        let user = await User.findOneAndUpdate({ token: { $in: [token] } }, { $pull: { token: token } }, { useFindAndModify: false });

        if (!token || !user) {
            return res.json({ error: 1, message: 'No user found!!!' });
        }

        return res.json({
            error: 0,
            message: 'Logout success',
            statusCode: 200
        });

    } catch (err) {
        next();
    }
}


// untuk mengembalikan data user yang sudah login
const me = (req, res, next) => {
    if (!req.user) {
        return res.json({ error: 1, statusCode: 401, message: 'Your are not login or token expired' });
    }
    res.json({
        statusCode: 200,
        user: req.user
    });
}






module.exports = {
    register,
    localStrategy,
    update,
    login,
    logout,
    me
}