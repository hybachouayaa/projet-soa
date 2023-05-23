const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger les fichiers proto pour les films et les séries TV
const bikeProtoPath = 'bike.proto';
const carProtoPath = 'car.proto';
const resolvers = require('./resolvers');
const typeDefs = require('./schema');

// Créer une nouvelle application Express
const app = express();
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

// Créer une instance ApolloServer avec le schéma et les résolveurs importés
const server = new ApolloServer({ typeDefs, resolvers });

// Appliquer le middleware ApolloServer à l'application Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
server.start().then(() => {
    app.use(
        cors(),
        expressMiddleware(server),
    );
});

app.get('/bikes', (req, res) => {
    const client = new bikeProto.BikeService('localhost:50051',
        grpc.credentials.createInsecure());
    const { q } = req.query;
    client.searchBikes({ query: q }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.bikes);
        }
    });
});

app.post('/bike', (req, res) => {
    const { title, description } = req.body;
    clientBikes.createBike({ title: title, description: description }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.bike);
        }
    });
});

app.get('/bikes/:id', (req, res) => {
    const client = new bikeProto.BikeService('localhost:50051',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getBike({ bike_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.bike);
        }
    });
});

app.get('/cars', (req, res) => {
    const client = new carProto.CarService('localhost:50052',
        grpc.credentials.createInsecure());
    const { q } = req.query;
    client.searchCars({ query: q }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.cars);
        }
    });
});

app.post('/car', (req, res) => {
    const { title, description } = req.body;
    clientCars.createCar({ title: title, description: description }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.car);
        }
    });
});

app.get('/cars/:id', (req, res) => {
    const client = new carProto.CarService('localhost:50052',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getCar({ car_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.car);
        }
    });
});

// Démarrer l'application Express
const port = 3000;
app.listen(port, () => {
    console.log(`API Gateway is running on port ${port}`);
});