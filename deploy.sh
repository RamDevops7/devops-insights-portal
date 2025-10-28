#!/bin/bash
set -e
IMAGE="$1"
TAG="$2"
CONTAINER_NAME="devops-insights-portal"

# Pull the image
docker pull "${IMAGE}:${TAG}"

# Stop & remove old container if exists
if docker ps -q --filter "name=${CONTAINER_NAME}"; then
  docker stop ${CONTAINER_NAME} || true
fi
docker rm ${CONTAINER_NAME} || true

# Run new container (restart policy)
docker run -d --name ${CONTAINER_NAME} -p 80:3000 --restart unless-stopped ${IMAGE}:${TAG}

echo "Deployed ${IMAGE}:${TAG}"
