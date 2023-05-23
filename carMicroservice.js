const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mysql = require('mysql');

const carProtoPath = 'car.proto';
const carProtoDefinition = protoLoader.loadSync(carProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const carProto = grpc.loadPackageDefinition(carProtoDefinition).car;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_projet',
});

const carService = {
    getCar: (call, callback) => {
        const { car_id } = call.request;
        const query = 'SELECT * FROM cars WHERE id = ?';
        const values = [car_id];

        pool.query(query, values, (error, results) => {
            if (error) {
                callback(error);
            } else {
                const car = results[0];
                callback(null, { car });
            }
        });
    },
    searchCars: (call, callback) => {
        const { query } = call.request;
        const searchQuery = 'SELECT * FROM cars WHERE title LIKE ?';
        const values = [`%${query}%`];

        pool.query(searchQuery, values, (error, results) => {
            if (error) {
                callback(error);
            } else {
                const cars = results;
                callback(null, { cars });
            }
        });
    },
    createCar: (call, callback) => {
        const { title, description } = call.request;
        const query = 'INSERT INTO cars (title, description) VALUES (?, ?)';
        const values = [title, description];

        pool.query(query, values, (error, results) => {
            if (error) {
                callback(error);
            } else {
                const insertedId = results.insertId;
                const car = { id: insertedId, title, description };
                callback(null, { car });
            }
        });
    },
};

const server = new grpc.Server();
server.addService(carProto.CarService.service, carService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Failed to bind the server:', err);
        return;
    }
    console.log(`The server is running on port ${port}`);
    server.start();
});

console.log(`Car microservice is running on port ${port}`);
