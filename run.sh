#!/bin/bash
echo "=========================================="
echo "Starting TaskFlow Setup (Linux/Mac)..."
echo "=========================================="

# 1. Build the Spring Boot JAR
echo "Step 1: Building Backend..."
cd backend
chmod +x mvnw
./mvnw clean package -DskipTests
cd ..

# 2. Start Docker
echo "Step 2: Starting Docker Containers..."
docker-compose down
docker-compose up --build