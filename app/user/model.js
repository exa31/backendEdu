const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Schema, model } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    full_name: {
        type: String,
        required: [true, 'Name is required'],
        maxlength: [100, 'Name can not be more than 100 characters'],
        minlength: [2, 'Name can not be less than 2 characters']
    },
    costumer_id: {
        type: Number,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        maxlength: [100, 'Email can not be more than 100 characters'],
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password can not be less than 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    token: {
        type: [String]
    }
}, { timestamps: true });

userSchema.path('email').validate((email) => {
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
}, attr => `${attr.value} is not a valid email`);

// jadi ini adalah custom validator yang kita buat sendiri
userSchema.path('email').validate(async function (email) {
    try {
        //lakukan pencarian ke collerction user berdasarkan email
        const count = await this.model('User').countDocuments({ email: email })
        //jika count > 0 maka email sudah terdaftar
        //jika count = 0 maka email belum terdaftar
        return !count;
        //apabila ini tidak true maka fungsi yg ada param attr akan dijalankan sama spt diatas
    } catch (error) {
        throw error;
    }

}, // jadi ini akan mengembalikan pesan error jika email sudah terdaftar
    // dan ini adalaj validator dalam mongoose pesan ini akan di kirimkan ke client sama spt diatas
    attr => `${attr.value} already registered`);

const HASH_ROUND = 10;
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, HASH_ROUND);
    next();
});

userSchema.plugin(AutoIncrement, { inc_field: 'costumer_id' });

module.exports = model('User', userSchema);