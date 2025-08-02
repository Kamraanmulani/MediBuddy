#!/bin/bash

# Setup script to copy environment variables
echo "Setting up environment variables..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo ".env file created from .env.example"
    echo "Please edit .env file with your actual configuration values"
else
    echo ".env file already exists"
fi

echo "Don't forget to:"
echo "1. Update MONGODB_URI with your actual MongoDB connection string"
echo "2. Update JWT_SECRET with a secure random string"
echo "3. Update NEXT_PUBLIC_GEMINI_API_KEY with your Gemini API key"
echo "4. Update EMAIL_USER and EMAIL_PASS if you plan to use email notifications"
