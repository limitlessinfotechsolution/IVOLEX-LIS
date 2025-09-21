# API Documentation

## Overview
The Ivolex API provides endpoints for accessing product data and other e-commerce functionality. The API is built with Express.js and follows REST principles.

## Base URL
```
https://api.ivolex.vercel.com
```

## Endpoints

### Health Check
- **GET** `/health`
- Description: Check if the API is running
- Response: 
  ```json
  {
    "status": "OK",
    "timestamp": "2023-01-01T00:00:00.000Z",
    "service": "Ivolex API"
  }
  ```

### Products
- **GET** `/products`
- Description: Get all products
- Response: Array of product objects

- **GET** `/products/:id`
- Description: Get a specific product by ID
- Response: Product object or 404 error

- **GET** `/enhanced-products`
- Description: Get enhanced product data
- Response: Array of enhanced product objects

## Running the API

### Development
```bash
npm run dev:api
```

### Production
```bash
npm start
```

## Environment Variables
- `PORT`: Port to run the server on (default: 3001)

## Error Handling
All errors are returned in JSON format:
```json
{
  "error": "Error message"
}
```