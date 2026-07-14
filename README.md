# Medical Patient Record App (MVP)

A full-stack MVP for medical shop staff to manage patient medicine records.

## Stack

- **Frontend**: React Native (Expo), React Navigation Native Stack, Axios, AsyncStorage
- **Backend**: Node.js, Express, MongoDB, JWT, bcrypt

## Repository Structure

```text
backend/
frontend/
```

## Backend Setup (`/backend`)

1. Install dependencies:
   ```bash
   cd /home/runner/work/medical-record-app/medical-record-app/backend
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` values:
   - `PORT`
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
4. Start server:
   ```bash
   npm run dev
   ```

### Backend API Endpoints

- `POST /api/auth/login`
- `GET /api/patients`
- `GET /api/patients/:id`
- `GET /api/patients/search?q=`
- `POST /api/patients`
- `PUT /api/patients/:id`
- `DELETE /api/patients/:id`

All patient routes require a valid JWT token in the Authorization header.

## Frontend Setup (`/frontend`)

1. Install dependencies:
   ```bash
   cd /home/runner/work/medical-record-app/medical-record-app/frontend
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Set backend URL:
   - `EXPO_PUBLIC_API_BASE_URL=http://<your-local-ip>:5000/api`
4. Run Expo app:
   ```bash
   npm start
   ```

## Manual User Creation (No Signup API)

Users are created manually in MongoDB.

Generate a bcrypt hash from `/backend`:

```bash
node -e "const bcrypt=require('bcrypt');bcrypt.hash('your-password',10).then(h=>console.log(h));"
```

Insert into `users` collection:

```json
{
  "username": "staff1",
  "password": "<bcrypt-hash>"
}
```

## Notes

- `patientName` is required.
- `medicines` is stored as an array of objects: `{ name, dose }`.
- Search is case-insensitive by `patientName` or `mobile`.
- MongoDB indexes are applied on `patientName` and `mobile`.
