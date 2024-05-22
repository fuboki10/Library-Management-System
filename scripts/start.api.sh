#!/bin/sh

echo "Starting API server..."

sleep 1

# Run the migrations
echo "Running migrations..."
echo +npx prisma migrate deploy
npx prisma migrate deploy

echo +npx prisma generate
npx prisma generate

# Start the API server
echo "Starting API server..."
npm run start:prod