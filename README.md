# Hilton Restaurants Online Reservation System

A comprehensive online table reservation system for Hilton Restaurants built with Node.js, TypeScript, and SolidJS.

## Architecture

This mono-repo application follows a service-oriented architecture with the following components:

- **API Service**: Node.js/Express with RESTful authentication and GraphQL business services
- **Database Service**: Couchbase for data storage
- **Shared Utilities**: Common types, interfaces, and utilities
- **Customer Interface**: SolidJS application for customers to make reservations

## Features

- **RESTful Authentication**: JWT-based authentication with role-based access control
- **GraphQL Business Services**: Flexible reservation management and availability checking
- **Customer Interface**: User-friendly interface for making reservations
- **Database Integration**: Couchbase with proper indexing and performance optimization

## Technology Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: Couchbase
- **Frontend**: SolidJS, TypeScript
- **Authentication**: REST + JWT
- **API**: GraphQL for business logic
- **Containerization**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Node.js 20.0.0 or higher
- pnpm 10.11.0 or higher
- Docker and Docker Compose

### Development Setup

1. Clone the repository or unzip the tarball:

```bash
git clone git@github.com:dengbin752/online-reservation-system.git
cd online-reservation-system
```

2. Development environment setup:

```bash
./scripts/start.sh
(then choose option 3)

When resource download fails, please execute the above command using a proxy.
Such as: 
HTTPS_PROXY=http://127.0.0.1:7890 ./scripts/start.sh
```

3. Visit the application:

Valid services:

- Customer interface: [http://localhost:3001](http://localhost:3001)
- REST API: [http://localhost:3000](http://localhost:3000)
- GraphQL Debug Console: [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql)


## API Documentation

### RESTful Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### GraphQL Business Services

**Queries:**

- `reservations` - Get all reservations
- `reservation(id)` - Get specific reservation
- `availableTables(date, time)` - Check table availability
- `customerReservations(customerId)` - Get customer's reservations

**Mutations:**

- `createReservation(input)` - Create new reservation
- `updateReservation(id, input)` - Update reservation
- `cancelReservation(id)` - Cancel reservation
- `updateReservationStatus(id, status)` - Change reservation status

## Project Structure

```
quiz-online-reservation-system/
├── docker/                     # Docker files
├── packages/
│   ├── api/                    # Node.js/Express API service
│   ├── database/               # Couchbase configuration and utilities
│   ├── shared/                 # Shared types, interfaces, and utilities
│   └── customer-ui/            # Customer-facing SolidJS interface
├── scripts/                    # Scripts for development and deployment
├── docker-compose.yml
├── docker-compose.dev.yml      # Development-specific configuration
├── package.json
├── pnpm-workspace.yaml         # pnpm workspace configuration
├── tsconfig.json
└── README.md
```

## Environment Variables

### API Service

- `NODE_ENV` - Environment (development/production)
- `COUCHBASE_HOST` - Couchbase host
- `COUCHBASE_USERNAME` - Couchbase username
- `COUCHBASE_PASSWORD` - Couchbase password
- `COUCHBASE_BUCKET` - Couchbase bucket name
- `JWT_SECRET` - JWT secret key
- `PORT` - API service port

### Frontend Services

- `API_BASE_URL` - Base URL for API service
