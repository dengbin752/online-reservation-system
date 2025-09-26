#!/bin/bash

# Development Startup Script
# This script starts the entire Hilton Restaurants reservation system

echo "🚀 Starting Hilton Restaurants Reservation System -- Only Backend API Development"
echo "=================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if required files exist
if [ ! -f "docker-compose.dev.yml" ]; then
    echo "❌ docker-compose.dev.yml not found. Please run this script from the project root."
    exit 1
fi

# Start services
echo "🐳 Starting Docker containers..."
docker-compose -f docker-compose.dev.yml up -d couchbase

# Initialize Couchbase
echo "📊 Initializing Couchbase database..."
"$SCRIPT_DIR/utils/init-couchbase-for-dev.sh" docker-compose.dev.yml

# Start API service
echo "🔧 Starting API service..."
docker-compose -f docker-compose.dev.yml up -d api

# Wait for API to be ready
echo "⏳ Waiting for API to be ready..."
sleep 10

# # Start customer UI
echo "🎨 Starting Customer UI..."
docker-compose -f docker-compose.dev.yml up -d customer-ui

# # Start admin UI
# echo "👨‍💼 Starting Admin UI..."
# docker-compose up -d admin-ui

# Display status
echo ""
echo "✅ All services started successfully!"
echo "=================================================="
echo "🌐 Customer Interface: http://localhost:3001"
# echo "👨‍💼 Admin Interface: http://localhost:3002"
echo "🔌 API Health Check: http://localhost:3000/health"
echo "🔌 GraphQL Endpoint: http://localhost:3000/api/graphql"
echo "📊 Couchbase Web Console: http://localhost:8091"
echo ""
echo "🔐 Default Admin Credentials:"
echo "   Email: admin@example.com"
echo "   Password: password"
echo ""
echo "🧪 Test the API with: ./scripts/test-api.sh"
echo "🛑 Stop all services with: ./scripts/stop-dev.sh"
echo "=================================================="