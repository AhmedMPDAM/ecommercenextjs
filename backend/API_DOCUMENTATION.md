# E-Commerce API Documentation

## Overview

**Base URL:** `http://localhost:5000/api`

**Version:** 1.0.0

This document provides comprehensive documentation for the E-Commerce API. The API follows RESTful principles and uses JSON for request and response payloads.

## Table of Contents

- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Error Responses](#error-responses)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-endpoints)
  - [Users](#user-endpoints)
  - [Profiles](#profile-endpoints)
  - [Products](#product-endpoints)
  - [Orders](#order-endpoints)
  - [Wishlist](#wishlist-endpoints)
- [Data Models](#data-models)

---

## Authentication

The API uses **JWT (JSON Web Tokens)** for authentication. Protected endpoints require a valid JWT token in the Authorization header.

### Obtaining a Token

1. Register a new user via `POST /api/auth/register`
2. Login via `POST /api/auth/login`
3. Use the returned token in subsequent requests

### Using the Token

Include the token in the Authorization header of your requests:

```
Authorization: Bearer <your-jwt-token>
```

### Token Expiration

Tokens expire after 24 hours. After expiration, you'll need to login again to obtain a new token.

---

## Rate Limiting

The API implements rate limiting to prevent abuse and ensure fair usage.

### Rate Limit Tiers

| Endpoint Type | Limit | Window | Status Code on Exceed |
|--------------|-------|--------|----------------------|
| **Authentication** (`/api/auth/*`) | No limit | - | - |
| **Products** (`/api/products/*`) | 200 requests | 15 minutes | 429 |
| **All Other Endpoints** | 100 requests | 15 minutes | 429 |

### Rate Limit Headers

Responses include the following headers to help you track your rate limit status:

- `RateLimit-Limit`: Maximum number of requests allowed in the window
- `RateLimit-Remaining`: Number of requests remaining in the current window
- `RateLimit-Reset`: Time when the rate limit window resets (Unix timestamp)

### Rate Limit Exceeded Response

When you exceed the rate limit, you'll receive a `429 Too Many Requests` response:

```json
{
  "status": "error",
  "message": "Too many requests from this IP, please try again later.",
  "retryAfter": "15 minutes"
}
```

---

## Error Responses

The API uses standard HTTP status codes and returns errors in a consistent JSON format.

### Error Response Format

```json
{
  "status": "error" | "fail",
  "message": "Human-readable error message"
}
```

### Common Status Codes

| Status Code | Description |
|------------|-------------|
| `200 OK` | Request succeeded |
| `201 Created` | Resource created successfully |
| `400 Bad Request` | Invalid request data |
| `401 Unauthorized` | Missing or invalid authentication token |
| `403 Forbidden` | Authenticated but not authorized |
| `404 Not Found` | Resource not found |
| `409 Conflict` | Resource already exists |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Server error |

---

## Endpoints

### Authentication Endpoints

#### Register a New User

**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2024-12-05T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields or invalid data
- `409 Conflict`: User with email already exists

---

#### Login

**POST** `/api/auth/login`

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials

---

#### Get Current User

**GET** `/api/auth/me`

Get the currently authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2024-12-05T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token

---

### User Endpoints

All user endpoints require authentication and are subject to rate limiting (100 requests per 15 minutes).

#### Get All Users

**GET** `/api/users`

Retrieve a list of all users.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "username": "johndoe",
        "email": "john@example.com",
        "createdAt": "2024-12-05T00:00:00.000Z"
      }
    ]
  }
}
```

---

#### Get User by ID

**GET** `/api/users/:id`

Retrieve a specific user by their ID.

**Parameters:**
- `id` (path): User ID

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2024-12-05T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `404 Not Found`: User not found

---

#### Update User

**PUT** `/api/users/:id`

Update user information.

**Parameters:**
- `id` (path): User ID

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "username": "johndoe_updated",
  "email": "newemail@example.com"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe_updated",
      "email": "newemail@example.com",
      "updatedAt": "2024-12-05T01:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid data
- `404 Not Found`: User not found

---

#### Delete User

**DELETE** `/api/users/:id`

Delete a user account.

**Parameters:**
- `id` (path): User ID

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `404 Not Found`: User not found

---

### Profile Endpoints

All profile endpoints require authentication and are subject to rate limiting (100 requests per 15 minutes).

#### Get User Profile

**GET** `/api/profiles/user/:userId`

Retrieve a user's profile.

**Parameters:**
- `userId` (path): User ID

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "profile": {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      },
      "createdAt": "2024-12-05T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `404 Not Found`: Profile not found

---

#### Create Profile

**POST** `/api/profiles`

Create a new user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "profile": {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      },
      "createdAt": "2024-12-05T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid data
- `409 Conflict`: Profile already exists

---

#### Update Profile

**PUT** `/api/profiles/:userId`

Update a user's profile.

**Parameters:**
- `userId` (path): User ID

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe Updated",
  "phone": "+1234567890"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "profile": {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe Updated",
      "phone": "+1234567890",
      "updatedAt": "2024-12-05T01:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid data
- `404 Not Found`: Profile not found

---

#### Delete Profile

**DELETE** `/api/profiles/:userId`

Delete a user's profile.

**Parameters:**
- `userId` (path): User ID

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Profile deleted successfully"
}
```

**Error Responses:**
- `404 Not Found`: Profile not found

---

### Product Endpoints

Product endpoints are public and do not require authentication. They are subject to rate limiting (200 requests per 15 minutes).

#### Get All Products

**GET** `/api/products`

Retrieve all products with optional pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Wireless Headphones",
        "description": "High-quality wireless headphones with noise cancellation",
        "price": 99.99,
        "category": "electronics",
        "image": "https://example.com/image.jpg",
        "rating": {
          "rate": 4.5,
          "count": 120
        },
        "stock": 50
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20
    }
  }
}
```

---

#### Search Products

**GET** `/api/products/search`

Search for products by title or description.

**Query Parameters:**
- `q` (required): Search query
- `page` (optional): Page number
- `limit` (optional): Items per page

**Example:**
```
GET /api/products/search?q=headphones&page=1&limit=10
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Wireless Headphones",
        "price": 99.99,
        "category": "electronics"
      }
    ],
    "count": 1
  }
}
```

---

#### Get All Categories

**GET** `/api/products/categories`

Retrieve all product categories.

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "categories": [
      "electronics",
      "clothing",
      "books",
      "home & garden"
    ]
  }
}
```

---

#### Get Products by Category

**GET** `/api/products/category/:category`

Retrieve all products in a specific category.

**Parameters:**
- `category` (path): Category name

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Wireless Headphones",
        "price": 99.99,
        "category": "electronics"
      }
    ],
    "category": "electronics"
  }
}
```

---

#### Get Product by ID

**GET** `/api/products/:id`

Retrieve a specific product by ID.

**Parameters:**
- `id` (path): Product ID

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "product": {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Wireless Headphones",
      "description": "High-quality wireless headphones with noise cancellation",
      "price": 99.99,
      "category": "electronics",
      "image": "https://example.com/image.jpg",
      "rating": {
        "rate": 4.5,
        "count": 120
      },
      "stock": 50
    }
  }
}
```

**Error Responses:**
- `404 Not Found`: Product not found

---

#### Create Product

**POST** `/api/products`

Create a new product (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Wireless Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "price": 99.99,
  "category": "electronics",
  "image": "https://example.com/image.jpg",
  "rating": {
    "rate": 4.5,
    "count": 120
  },
  "stock": 50
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "product": {
      "id": 101,
      "_id": "507f1f77bcf86cd799439013",
      "title": "Wireless Headphones",
      "description": "High-quality wireless headphones with noise cancellation",
      "price": 99.99,
      "category": "electronics",
      "image": "https://example.com/image.jpg",
      "rating": {
        "rate": 4.5,
        "count": 120
      },
      "stock": 50,
      "createdAt": "2024-12-05T00:00:00.000Z",
      "updatedAt": "2024-12-05T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields (title, price, category) or invalid price
- `401 Unauthorized`: Missing or invalid authentication token

---

#### Update Product

**PUT** `/api/products/:id`

Update an existing product (requires authentication).

**Parameters:**
- `id` (path): Product ID

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Wireless Headphones Pro",
  "price": 129.99,
  "stock": 75
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "product": {
      "id": 101,
      "_id": "507f1f77bcf86cd799439013",
      "title": "Wireless Headphones Pro",
      "description": "High-quality wireless headphones with noise cancellation",
      "price": 129.99,
      "category": "electronics",
      "stock": 75,
      "updatedAt": "2024-12-05T01:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid product ID or data
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Product not found

---

#### Delete Product

**DELETE** `/api/products/:id`

Delete a product (requires authentication).

**Parameters:**
- `id` (path): Product ID

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Product deleted successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid product ID
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Product not found

---

### Category Management Endpoints

All category management endpoints require authentication and are subject to rate limiting (200 requests per 15 minutes).

#### Create Category

**POST** `/api/products/categories`

Create a new category (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "sports",
  "description": "Sports and outdoor equipment"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "category": {
      "_id": "507f1f77bcf86cd799439020",
      "name": "sports",
      "description": "Sports and outdoor equipment",
      "createdAt": "2024-12-05T00:00:00.000Z",
      "updatedAt": "2024-12-05T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing category name
- `401 Unauthorized`: Missing or invalid authentication token
- `409 Conflict`: Category already exists

---

#### Update Category

**PUT** `/api/products/categories/:id`

Update an existing category (requires authentication).

**Parameters:**
- `id` (path): Category ID (MongoDB ObjectId)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "sports & outdoors",
  "description": "Sports, outdoor equipment, and fitness gear"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "category": {
      "_id": "507f1f77bcf86cd799439020",
      "name": "sports & outdoors",
      "description": "Sports, outdoor equipment, and fitness gear",
      "updatedAt": "2024-12-05T01:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid category ID
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Category not found

---

#### Delete Category

**DELETE** `/api/products/categories/:id`

Delete a category (requires authentication).

**Parameters:**
- `id` (path): Category ID (MongoDB ObjectId)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Category deleted successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid category ID
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Category not found

---

### Order Endpoints

All order endpoints require authentication and are subject to rate limiting (100 requests per 15 minutes).

#### Create Order

**POST** `/api/orders`

Create a new order.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439013",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "totalAmount": 199.98,
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "order": {
      "_id": "507f1f77bcf86cd799439014",
      "userId": "507f1f77bcf86cd799439011",
      "items": [
        {
          "productId": "507f1f77bcf86cd799439013",
          "quantity": 2,
          "price": 99.99
        }
      ],
      "totalAmount": 199.98,
      "status": "pending",
      "shippingAddress": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      },
      "createdAt": "2024-12-05T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid order data

---

#### Get All Orders

**GET** `/api/orders`

Retrieve all orders (admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "userId": "507f1f77bcf86cd799439011",
        "totalAmount": 199.98,
        "status": "pending",
        "createdAt": "2024-12-05T00:00:00.000Z"
      }
    ]
  }
}
```

---

#### Get User Orders

**GET** `/api/orders/user/:userId`

Retrieve all orders for a specific user.

**Parameters:**
- `userId` (path): User ID

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "userId": "507f1f77bcf86cd799439011",
        "totalAmount": 199.98,
        "status": "pending",
        "createdAt": "2024-12-05T00:00:00.000Z"
      }
    ]
  }
}
```

---

#### Get Order by ID

**GET** `/api/orders/:id`

Retrieve a specific order by ID.

**Parameters:**
- `id` (path): Order ID

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "order": {
      "_id": "507f1f77bcf86cd799439014",
      "userId": "507f1f77bcf86cd799439011",
      "items": [
        {
          "productId": "507f1f77bcf86cd799439013",
          "quantity": 2,
          "price": 99.99
        }
      ],
      "totalAmount": 199.98,
      "status": "pending",
      "shippingAddress": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      },
      "createdAt": "2024-12-05T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `404 Not Found`: Order not found

---

#### Update Order Status

**PATCH** `/api/orders/:id/status`

Update the status of an order.

**Parameters:**
- `id` (path): Order ID

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "shipped"
}
```

**Valid Status Values:**
- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "order": {
      "_id": "507f1f77bcf86cd799439014",
      "status": "shipped",
      "updatedAt": "2024-12-05T01:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid status
- `404 Not Found`: Order not found

---

#### Delete Order

**DELETE** `/api/orders/:id`

Delete an order.

**Parameters:**
- `id` (path): Order ID

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Order deleted successfully"
}
```

**Error Responses:**
- `404 Not Found`: Order not found

---

### Wishlist Endpoints

All wishlist endpoints require authentication and are subject to rate limiting (100 requests per 15 minutes).

#### Add to Wishlist

**POST** `/api/wishlist`

Add a product to the user's wishlist.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "productId": "507f1f77bcf86cd799439013"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "wishlistItem": {
      "_id": "507f1f77bcf86cd799439015",
      "userId": "507f1f77bcf86cd799439011",
      "productId": "507f1f77bcf86cd799439013",
      "createdAt": "2024-12-05T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid data
- `409 Conflict`: Product already in wishlist

---

#### Get User Wishlist

**GET** `/api/wishlist/user/:userId`

Retrieve a user's wishlist.

**Parameters:**
- `userId` (path): User ID

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "wishlist": [
      {
        "_id": "507f1f77bcf86cd799439015",
        "userId": "507f1f77bcf86cd799439011",
        "productId": "507f1f77bcf86cd799439013",
        "product": {
          "title": "Wireless Headphones",
          "price": 99.99,
          "image": "https://example.com/image.jpg"
        },
        "createdAt": "2024-12-05T00:00:00.000Z"
      }
    ]
  }
}
```

---

#### Remove from Wishlist

**DELETE** `/api/wishlist/:id`

Remove a specific item from the wishlist.

**Parameters:**
- `id` (path): Wishlist item ID

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Item removed from wishlist"
}
```

**Error Responses:**
- `404 Not Found`: Wishlist item not found

---

#### Clear Wishlist

**DELETE** `/api/wishlist/user/:userId/clear`

Remove all items from a user's wishlist.

**Parameters:**
- `userId` (path): User ID

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Wishlist cleared successfully"
}
```

---

## Data Models

### User

```json
{
  "_id": "string (ObjectId)",
  "username": "string",
  "email": "string (unique)",
  "password": "string (hashed)",
  "createdAt": "string (ISO 8601 date)",
  "updatedAt": "string (ISO 8601 date)"
}
```

### Profile

```json
{
  "_id": "string (ObjectId)",
  "userId": "string (ObjectId reference)",
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  },
  "createdAt": "string (ISO 8601 date)",
  "updatedAt": "string (ISO 8601 date)"
}
```

### Product

```json
{
  "_id": "string (ObjectId)",
  "title": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "image": "string (URL)",
  "rating": {
    "rate": "number",
    "count": "number"
  },
  "stock": "number"
}
```

### Order

```json
{
  "_id": "string (ObjectId)",
  "userId": "string (ObjectId reference)",
  "items": [
    {
      "productId": "string (ObjectId reference)",
      "quantity": "number",
      "price": "number"
    }
  ],
  "totalAmount": "number",
  "status": "string (pending|processing|shipped|delivered|cancelled)",
  "shippingAddress": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  },
  "createdAt": "string (ISO 8601 date)",
  "updatedAt": "string (ISO 8601 date)"
}
```

### Wishlist Item

```json
{
  "_id": "string (ObjectId)",
  "userId": "string (ObjectId reference)",
  "productId": "string (ObjectId reference)",
  "createdAt": "string (ISO 8601 date)"
}
```

---

## Support

For issues or questions, please contact the development team or open an issue in the project repository.

**Last Updated:** December 5, 2024
