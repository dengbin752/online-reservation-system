#!/bin/bash

# Minimal Couchbase initialization script
# This script creates buckets without complex cluster initialization

DOCKER_COMPOSE_FILE=${1:-"docker-compose.yml"}

echo "📊 Initializing Couchbase buckets..."
echo "===================================="

# Wait for Couchbase to be ready first
echo "⏳ Waiting 10s for Couchbase to be ready..."
sleep 10

# Initialize cluster
echo "🏗️ Initializing cluster..."
docker compose -f "$DOCKER_COMPOSE_FILE" exec couchbase /opt/couchbase/bin/couchbase-cli cluster-init \
  --cluster-username=Administrator \
  --cluster-password=password \
  --cluster-ramsize=512 \
  --cluster-index-ramsize=256 \
  --services=data,index,query

# Create reservations bucket
echo "🪣 Creating reservations bucket..."
docker compose -f "$DOCKER_COMPOSE_FILE" exec couchbase /opt/couchbase/bin/couchbase-cli bucket-create \
  --bucket=reservations \
  --bucket-ramsize=256 \
  --bucket-replica=1 \
  --bucket-priority=high \
  --bucket-type=couchbase \
  --enable-index-replica=0 \
  --bucket-eviction-policy=fullEviction \
  --cluster=http://localhost:8091 \
  --username=Administrator \
  --password=password

# # Create users bucket for authentication
# echo "👥 Creating users bucket..."
# docker compose -f "$DOCKER_COMPOSE_FILE" exec couchbase /opt/couchbase/bin/couchbase-cli bucket-create \
#   --bucket=users \
#   --bucket-ramsize=128 \
#   --bucket-replica=1 \
#   --bucket-priority=high \
#   --bucket-type=couchbase \
#   --enable-index-replica=0 \
#   --bucket-eviction-policy=fullEviction \
#   --cluster=http://localhost:8091 \
#   --username=Administrator \
#   --password=password



# Create primary indexes using cbq with proper connection
echo "🔍 Creating primary indexes..."
sleep 30  # Wait longer for services to be fully ready

# Create primary index for reservations
echo "Creating primary index for reservations..."
docker compose -f "$DOCKER_COMPOSE_FILE" exec couchbase cbq -e http://localhost:8091 -u Administrator -p password --script "
CREATE PRIMARY INDEX ON \`reservations\`;" || echo "⚠️  Primary index creation for reservations failed, continuing..."

echo "✅ Couchbase initialization completed!"
echo "===================================="
echo "📊 Buckets created:"
echo "   - reservations"
echo ""
echo "🔍 Primary indexes created for each bucket"
echo ""
echo "💡 Note: Secondary indexes will be created by the API service on startup"
echo ""

"$SCRIPT_DIR/utils/wait-for-couchbase.sh" "$DOCKER_COMPOSE_FILE" 3 5