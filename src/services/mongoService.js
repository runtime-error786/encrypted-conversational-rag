const { MongoClient } = require('mongodb');
const { mongoUrl } = require('../config');

const client = new MongoClient(mongoUrl);
let db;

const connectToMongoDB = async () => {
    await client.connect();
    db = client.db();
};

connectToMongoDB().catch(console.error);

const getDB = () => db;

module.exports = { getDB };
