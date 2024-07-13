# Project Overview

This project is divided into three main components: Frontend, AuthBackendAPI (Authentication and Organization Management), and Backend (Excel Validator). These components work together to provide a comprehensive microservices architecture for user authentication, organization management, and data validation.

# Table of Contents

Project Overview
Frontend
AuthBackendAPI
Backend
Setup Instructions
API Endpoints
Frontend User Flow

# Frontend

The frontend application provides a user interface for the functionalities offered by the backend services. It includes the following features:

User login
OTP verification
Role-based access control (User/Admin)
Organization management (Create, Update, Delete)
Excel file upload, review, and validation

# Technologies Used

React
Material-UI
React Router
Axios

# AuthBackendAPI

The AuthBackendAPI is responsible for handling user authentication and organization management. It includes the following features:

User signup
User login
OTP verification
Organization creation
Organization update
Organization deletion
Technologies Used
Node.js
Express.js
JWT for authentication
Sequelize for ORM

# Backend

The Backend service focuses on validating and processing Excel files. It includes the following features:

Excel file upload
Column name mapping
Data review and editing
Data validation
Storing ingestion records

# Technologies Used

Node.js
Express.js
Multer for file uploads
xlsx for parsing Excel files
Sequelize for ORM

# Setup Instructions

# Prerequisites

Node.js
npm
MySQL supported database for Sequelize

# For AuthBackendAPI

cd authbackendapi
npm install

# For Backend

cd ../backend
npm install

# For Frontend

cd ../frontend
npm install

# Setup environment variables:

Create .env files in authbackendapi, backend, and frontend directories
with the necessary configuration variables.

# Run the services:

# Start AuthBackendAPI

cd authbackendapi
npm start

# Start Backend

cd ../backend
npm start

# Start Frontend

cd ../frontend
npm start

# API Endpoints

AuthBackendAPI

# Base url

http://localhost:9000/api

POST /signup - Create a new user
POST /login - Authenticate a user
POST /verifyotp - Verify OTP

POST /createOrganizations - Create a new organization
PUT /updateOrganizations/id

# Backend

# Base url

http://localhost:5000/api

POST /upload - Upload and process an Excel file

GET /fetchIngestionRecords?page=2&itemsPerPage=2/  - fetch ingestion records

DELETE /deleteIngestionRecord/37 -delete ingestion records

POST /SaveMappingFile - save mapping file

GET /fetchIngestionDetails/105?page=6 - Get user records

PUT /updateUserDetails - update user details

DELETE /deleteUserRecords/52/details - Delete user records

GET /InternalColumnHeader - get internal column header

GET /authorize - check authorization with the help of token

# Frontend User Flow

Login:

User enters email and password to log in.
OTP verification is required to complete the login process.

# Role-based Access:

Users with 'admin' role can access organization management features.
Both users and admins can upload and review Excel files.
Organization Management (Admin only):

Create a new organization.
Update existing organization details.
Delete an organization.
Excel File Handling:

Upload an Excel file.(Admin Only)
Map column names to mandatory column names.
Review and edit the content of the Excel file.
Submit the reviewed data for validation and storage.
