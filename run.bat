:: for Windows
@echo off
echo ==========================================
echo Starting TaskFlow Setup (Windows)...
echo ==========================================

:: 1. Build the Spring Boot JAR
echo Step 1: Building Backend...
cd backend
call mvnw.cmd clean package -DskipTests
cd ..

:: 2. Start Docker
echo Step 2: Starting Docker Containers...
docker-compose down
docker-compose up --build

pause