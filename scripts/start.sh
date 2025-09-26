#!/bin/bash

# Get the directory where this script is located
export SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Hilton Restaurants Reservation System"
echo "========================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Show available options
echo ""
echo "📋 Available startup options:"
echo "1. ..."
echo "2. ..."
echo "3. Start development mode"
echo "4. Stop all services"
echo "5. Exit"
echo ""

# Read user choice
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        ;;
    2)
        ;;
    3)
        echo "🚀 Starting development mode..."
        "$SCRIPT_DIR/dev/start-dev.sh"
        ;;
    4)
        echo "🚀 Quick start with simple setup..."
        "$SCRIPT_DIR/dev/stop-dev.sh"
        ;;
    5)
        echo "👋 Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac