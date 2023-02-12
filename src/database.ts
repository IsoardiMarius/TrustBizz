// import {Client} from "pg";
// require('dotenv').config();
//
//
//
// const client = new Client({
//     user: process.env.PGUSER,
//     host: process.env.PGHOST,
//     database: process.env.PGDATABASE,
//     port: parseInt(process.env.PGPORT),
// })
//
// export const connectToDatabase = async () => {
//     await client.connect()
//         .then((res) => console.log('Connection success to database ' + process.env.PGDATABASE + ' on port ' + process.env.PGPORT))
//         .catch(err => console.error('Connection error', err.stack));
// }
//

const { Client } = require('pg');

const client = new Client({
    user: 'mariusisoardi',
    host: 'localhost',
    database: 'trustbizz',
    port: 5432,
});

client.connect()
    .then(() => console.log('Connected to database'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = client;