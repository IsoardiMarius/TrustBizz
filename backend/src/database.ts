const { Client } = require('pg');
require('dotenv').config();

// Create a new client instance
const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT
});


client.connect()
    .then(() => console.log('Connected to database : ' + client.database))
    .catch(err => console.error('Connection error', err.stack));

module.exports = client;