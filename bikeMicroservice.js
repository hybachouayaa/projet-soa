// bikeMicroservice.js
// graphql
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
var mysql = require('mysql');

// Charger le fichier bike.proto
const bikeProtoPath = 'bike.proto';
const bikeProtoDefinition = protoLoader.loadSync(bikeProtoPath, {
 keepCase: true,
 longs: String,
 enums: String,
 defaults: true,
 oneofs: true,
});

const bikeProto = grpc.loadPackageDefinition(bikeProtoDefinition).bike;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_projet',
});

const bikeService = {
    getBike: (call, callback) => {
        const { bike_id } = call.request;
        const query = 'SELECT * FROM bikes WHERE id = ?';
        const values = [bike_id];

        pool.query(query, values, (error, results) => {
            if (error) {
                callback(error);
            } else {
                const bike = results[0];
                callback(null, { bike });
            }
        });
    },
    searchBikes: (call, callback) => {
        const { query } = call.request;
        const searchQuery = 'SELECT * FROM bikes WHERE title LIKE ?';
        const values = [`%${query}%`];

        pool.query(searchQuery, values, (error, results) => {
            if (error) {
                callback(error);
            } else {
                const bikes = results;
                callback(null, { bikes });
            }
        });
    },
    createBike: (call, callback) => {
        const { title, description } = call.request;
        const query = 'INSERT INTO bikes (title, description) VALUES (?, ?)';
        const values = [title, description];

        pool.query(query, values, (error, results) => {
            if (error) {
                callback(error);
            } else {
                const insertedId = results.insertId;
                const bike = { id: insertedId, title, description };
                callback(null, { bike });
            }
        });
    },
    Deletebike: (call, callback) => {
        const { bike_id } = call.request;
        const query = 'DELETE FROM bikes WHERE id = ?';
        const values = [bike_id];
      
        pool.query(query, values, (error, results) => {
          if (error) {
            callback(error);
          } else {
            const success = results.affectedRows > 0;
            callback(null, { success });
          }
        });
      },
    
};



const server = new grpc.Server();
server.addService(bikeProto.BikeService.service, bikeService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), 
(err, port) => {
 if (err) {
 console.error('Failed to bind the server:', err);
 return;
 }
 console.log(`The server is running on port ${port}`);
 server.start();
});

console.log(`Bikes microservice is running on port ${port}`);
