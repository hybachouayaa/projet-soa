API Gateway

The API Gateway is an interface between an Apollo Server and two gRPC services for handling bikes and cars. It exposes HTTP endpoints for interacting with the services and provides a unified interface for accessing the underlying gRPC services through GraphQL.

Endpoints
The API Gateway exposes the following endpoints:

Bikes

GET /bikes?q={query} - Search for bikes based on the query parameter.
POST /bike - Create a new bike. Body parameters: title, description.
GET /bikes/:id - Get details of a specific bike by ID.
DELETE /bikes/:id - Delete a specific bike by ID.

Cars
GET /cars?q={query} - Search for cars based on the query parameter.
POST /car - Create a new car. Body parameters: title, description.
GET /cars/:id - Get details of a specific car by ID.

Please note that the API Gateway internally communicates with the bike and car gRPC services running on localhost:50051 and localhost:50052, respectively. Make sure these services are up and running before using the API Gateway.

Dependencies
The API Gateway uses the following dependencies:

Express: Web server framework for handling HTTP requests.
Apollo Server: GraphQL server for processing GraphQL queries and mutations.
body-parser: Middleware for parsing request bodies.
cors: Middleware for enabling Cross-Origin Resource Sharing (CORS).
gRPC: Library for implementing gRPC clients and servers.
proto-loader: Utility for loading protobuf files.
Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, 
please open an issue or submit a pull request.

