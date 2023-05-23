const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger les fichiers proto pour les bikes et les cars
const bikeProtoPath = 'bike.proto';
const carProtoPath = 'car.proto';

const bikeProtoDefinition = protoLoader.loadSync(bikeProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const carProtoDefinition = protoLoader.loadSync(carProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const bikeProto = grpc.loadPackageDefinition(bikeProtoDefinition).bike;
const carProto = grpc.loadPackageDefinition(carProtoDefinition).car;

const clientBikes = new bikeProto.BikeService('localhost:50051', grpc.credentials.createInsecure());
const clientCars = new carProto.CarService('localhost:50052', grpc.credentials.createInsecure());

// Définir les résolveurs pour les requêtes GraphQL
const resolvers = {
    Query: {
        bike: (_, { id }) => {
            // Effectuer un appel gRPC au microservice de bikes
            const client = new bikeProto.BikeService('localhost:50051',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.getBike({ bike_id: id }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.bike);
                    }
                });
            });
        },
        bikes: () => {
            // Effectuer un appel gRPC au microservice de bikes
            const client = new bikeProto.bikeService('localhost:50051',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.searchBikes({}, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.bikes);
                    }
                });
            });
        },

        car: (_, { id }) => {
            // Effectuer un appel gRPC au microservice de cars
            const client = new carProto.CarService('localhost:50052',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.getCar({ car_id: id }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.car);
                    }
                });
            });
        },

        cars: () => {
            // Effectuer un appel gRPC au microservice de cars
            const client = new carProto.CarService('localhost:50052',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.searchCars({}, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.car);
                    }
                });
            });
        },
    },
    Mutation: {
        createBike: (_, { id, title, description }) => {
            return new Promise((resolve, reject) => {
                clientBikes.createBike({ bike_id: id, title: title, description: description }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.bike);
                    }
                });
            });
        },
        createCar: (_, { id, title, description }) => {
            return new Promise((resolve, reject) => {
                clientCars.createCar({ car_id: id, title: title, description: description }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.car);
                    }
                });
            });
        },
    }
};

module.exports = resolvers;