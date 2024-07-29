const { AbilityBuilder, Ability } = require('@casl/ability');

function getToken(req) {
    //jadi token ini bakan di cek kalo req.headers.authorization ada isinya
    const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;
    //kalo ada isinya dia bakal return token, kalo ga ada isinya dia bakal return null
    return token && token.length ? token : null;
}

// ini adlah deklarasi policies
const policies = {
    guest(user, { can }) {
        can('read', 'Product');
    },
    user(user, { can }) {
        // ini actionnya dan subjectnya
        can('read', 'Product');// defaulnya (action, subject, conditions)
        can('create', 'Order');
        can('read', 'Order', { user_id: user._id });
        can('update', 'User', { user_id: user._id });
        can('read', 'Cart', { user_id: user._id });
        can('update', 'Cart', { user_id: user._id });
        can('read', 'DeliveryAddress'), { user_id: user._id };
        can('create', 'DeliveryAddress', { user_id: user._id });
        can('update', 'DeliveryAddress', { user_id: user._id });
        can('delete', 'DeliveryAddress', { user_id: user._id });
        can('read', 'Invoice', { user_id: user._id });
    },
    admin(user, { can }) {
        can('manage', 'all');
    }
}

const policyFor = (user) => {
    const builder = new AbilityBuilder();
    if (user && typeof policies[user.role] === 'function') {
        policies[user.role](user, builder);
    } else {
        policies['guest'](user, builder);
    }
    return new Ability(builder.rules);
}

module.exports = {
    getToken,
    policyFor
};