const mongoose = require('mongoose');
const { dbHost, dbPort, dbUser, dbPass, dbName, atlasCluster } = require('../app/config');

// mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`).then(() => {
//     console.log('Database connected');
// }).catch((err) => {
//     console.log('Database connection error', err);
// });
mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}${atlasCluster}/${dbName}?retryWrites=true&w=majority&appName=AtlasCluster`).then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.log('Database connection error', err);
});

const db = mongoose.connection;

module.exports = db;