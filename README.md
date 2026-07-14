# Medical Patient Record App (MVP)

## Project Requirements Document (PRD)

# Project Overview

## Objective

Build a full-stack Android mobile application for a medical shop to replace the existing paper-based patient register.

Currently, every patient has a dedicated page in a physical register containing their medicine details, doctor information, contact details, and notes. Whenever a patient visits, the staff manually searches the register by name to find the patient's medicines.

The goal of this application is to digitize that process, allowing staff to quickly search for a patient by name or mobile number and instantly access their medicine record.

This application is **not** intended to be:

* An online pharmacy
* An e-commerce application
* A billing system
* An inventory management system

Its only purpose in Version 1 (MVP) is to manage patient medicine records efficiently.

---

# Target Platform

* Android Mobile Application
* React Native (Expo)
* Node.js + Express.js Backend
* MongoDB Database

---

# Tech Stack

## Frontend

* React Native (Expo - Latest Stable SDK)
* React Navigation (Native Stack)
* Axios
* AsyncStorage
* Expo Vector Icons

## Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* bcrypt

---

# Project Architecture

Frontend (React Native Expo)

↓

REST API

↓

Node.js + Express

↓

MongoDB

---

# Authentication

Only authorized medical shop staff should access the application.

## Login Screen

Fields

* Username
* Password

Requirements

* No Signup Screen
* Users will be created manually in MongoDB
* Passwords must be hashed using bcrypt
* Use JWT Authentication
* Store JWT securely using AsyncStorage

---

# Application Flow

Login

↓

Home

↓

Search Patient

↓

Patient Details

↓

Edit Patient

OR

↓

Add Patient

---

# Features

## 1. Login

* Username
* Password
* JWT Authentication
* Redirect to Home after successful login

---

## 2. Home Screen

Display

* Search Bar
* Add Patient Button
* Recent Patient List (optional)
* Total Patient Count (optional)

---

## 3. Search Patient

Search by

* Patient Name
* Mobile Number

Requirements

* Real-time search while typing
* Case-insensitive search
* Fast MongoDB queries
* Clicking a patient opens Patient Details

---

## 4. Add Patient

Fields

* Patient Name (Required)
* Mobile Number
* Address
* Doctor Name
* Doctor Address
* Disease
* Medicines
* Notes

Buttons

* Save
* Cancel

Validation

Patient Name is mandatory.

---

## 5. Patient Details

Display

* Patient Name
* Mobile Number
* Address
* Doctor Name
* Doctor Address
* Disease
* Medicines
* Notes
* Created Date
* Updated Date

Buttons

* Edit
* Delete

---

## 6. Edit Patient

Allow updating every field.

---

## 7. Delete Patient

Show confirmation dialog before deleting.

---

# Medicine Data Structure

Medicines must **not** be stored as one long string.

Store medicines as an array.

Example

```json
{
  "medicines": [
    {
      "name": "Telma 40",
      "dose": "1-0-0"
    },
    {
      "name": "Glycomet 500",
      "dose": "1-0-1"
    }
  ]
}
```

Each medicine should contain

* Medicine Name
* Dose

---

# Database Design

## User Collection

```javascript
{
  _id,
  username,
  password,
  createdAt,
  updatedAt
}
```

---

## Patient Collection

```javascript
{
  _id,

  patientName,

  mobile,

  address,

  doctorName,

  doctorAddress,

  disease,

  medicines: [
    {
      name,
      dose
    }
  ],

  notes,

  createdAt,

  updatedAt
}
```

---

# REST API Endpoints

## Authentication

POST /api/auth/login

---

## Patients

GET /api/patients

GET /api/patients/:id

GET /api/patients/search?q=

POST /api/patients

PUT /api/patients/:id

DELETE /api/patients/:id

---

# Frontend Folder Structure

```text
frontend/

assets/

src/

    components/

        CustomButton.js

        PatientCard.js

        SearchBar.js

    navigation/

        AppNavigator.js

    screens/

        LoginScreen.js

        HomeScreen.js

        AddPatientScreen.js

        PatientDetailsScreen.js

        EditPatientScreen.js

    services/

        api.js

    utils/

        constants.js

App.js

app.json

package.json
```

---

# Backend Folder Structure

```text
backend/

config/

    db.js

controllers/

    authController.js

    patientController.js

middleware/

    authMiddleware.js

models/

    User.js

    Patient.js

routes/

    authRoutes.js

    patientRoutes.js

.env

server.js

package.json
```

---

# Required Frontend Dependencies

* @react-navigation/native
* @react-navigation/native-stack
* react-native-screens
* react-native-safe-area-context
* react-native-gesture-handler
* react-native-reanimated
* axios
* @react-native-async-storage/async-storage
* @expo/vector-icons

---

# Required Backend Dependencies

* express
* mongoose
* dotenv
* cors
* bcrypt
* jsonwebtoken
* nodemon (development)

---

# UI Requirements

Theme

* White
* Blue
* Light Gray

Design Goals

* Minimal UI
* Fast loading
* Large search bar
* Large buttons
* Easy for medical shop staff
* Responsive layout
* Clean typography
* No unnecessary animations

---

# Validation Rules

Patient Name

Required

Mobile Number

Optional

Doctor Name

Optional

Doctor Address

Optional

Disease

Optional

Notes

Optional

---

# Security Requirements

* Hash passwords using bcrypt
* Protect all patient routes using JWT middleware
* Use environment variables for secrets
* Never expose passwords in API responses

---

# Performance Requirements

* Fast patient search
* MongoDB indexes on:

  * patientName
  * mobile
* Modular codebase
* Reusable React components
* Proper API error handling
* Consistent API response format

---

# Coding Standards

Frontend

* Functional Components only
* React Hooks
* Async/Await
* Reusable Components
* Clean folder structure

Backend

* MVC Architecture
* Separate Controllers
* Separate Routes
* Separate Models
* Clean REST APIs
* Proper HTTP Status Codes
* Consistent Naming
* Modular Code

---

# MVP Scope

## Include

* Login
* JWT Authentication
* Search Patient
* Add Patient
* Edit Patient
* Delete Patient
* View Patient Details
* MongoDB Storage
* React Native Expo Frontend
* Node.js Backend
* REST APIs

## Exclude

* Prescription Image Upload
* Camera
* Voice Search
* Barcode Scanner
* Medicine Stock Management
* Billing
* Reports
* Notifications
* Multiple User Roles
* Offline Mode
* PDF Export
* Printing
* Analytics
* Doctor Portal

These features are intentionally excluded from Version 1 and may be implemented in future releases.

---

# Development Requirements

The frontend **must be developed using React Native with Expo (latest stable SDK)**.

The application must:

* Run using Expo Go during development.
* Be compatible with EAS Build for future production Android builds.
* Use React Navigation for screen navigation.
* Use Axios for API communication.
* Store JWT using AsyncStorage.
* Keep the code clean, modular, and production-ready.

---

# Final Goal

The application should enable medical shop staff to:

1. Log in securely.
2. Search patients by name or mobile number.
3. Open a patient's record instantly.
4. View medicines and patient details.
5. Add new patients.
6. Update patient records.
7. Delete incorrect or duplicate records.

The application should prioritize **speed, simplicity, reliability, and ease of use**, making it suitable for daily operations in a medical shop.
