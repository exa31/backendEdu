const config = require("../app/config");
const { getToken, policyFor } = require("../utils")
const jwt = require('jsonwebtoken');
const User = require('../app/user/model');


function decodeToken() {
    return async function (req, res, next) {
        try {
            const token = getToken(req);

            if (!token) {
                return next();
            }

            // disini req.user dibuat untuk menyimpan hasil dari token yang sudah di decode
            //jadi req user ini mendapat token yang sudah di decode
            req.user = jwt.verify(token, config.secretKey);
            //jadi disini kita akan mencari user berdasarkan token yang sudah di decode
            let user = await User.findOne({ token: { $in: [token] } });

            if (!user) {
                res.json({ error: 1, message: 'Token expired' });
            }
        } catch (err) {
            if (err && err.name === 'JsonWebTokenError') {
                return res.json({ error: 1, message: err.message });
            }
            next(err);
        }
        return next();
    }
}

//middleware untuk cek hak akses
function police_check(action, subject) {
    return function (req, res, next) {
        // ini akan menghasilkan hak aksesnya
        const policy = policyFor(req.user);
        //jadi disini akan di cek apakah user yang sudah login bisa melakukan action dan subject yang di minta


        if (!policy.can(action, subject)) {
            return res.json({
                error: 1,
                message: `You're not allowed to ${action} ${subject}`
            });
        }
        next();
    }
}



module.exports = {
    decodeToken,
    police_check
};