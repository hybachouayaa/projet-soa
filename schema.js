const { gql } = require('@apollo/server');
// Définir le schéma GraphQL
const typeDefs = `#graphql
 type Bike {
 id: String!
 title: String!
 description: String!
 }
 type Car {
 id: String!
 title: String!
 description: String!
 }
 type Query {
 bike(id: String!): Bike
 bikes: [Bike]
 car(id: String!): Car
 cars: [Car]
 }

 type Mutation {
    createBike(title: String!, description: String!): Bike
    createCar(title: String!, description: String!): Car
}
`;
module.exports = typeDefs

