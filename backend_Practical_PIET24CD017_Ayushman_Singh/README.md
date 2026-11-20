# Backend Practical - PIET24CD017 - Ayushman Singh

## Folder structure
```
file/
  A1.js            -> Task 1 entry (Library Book Management API)
  A2.js            -> Task 2 entry (Student Portal server)
  A3.js            -> Task 2 test script (register, login, /profile, /students)
  library-api/     -> models/, routes/, middleware/, server.js, .env, demo.js
  student-portal/  -> routes/, middleware/, app.js, server.js, config.js, db.js
outputs/           -> A1.png, A2.png, A3.png
```

## Task 1 - Library Book Management API (Express + Mongoose)
```
cd file/library-api
npm install
node ../A1.js          # MongoDB must be running; URL is in .env (MONGO_URL), port 3000
node demo.js           # (optional) tests all endpoints
```
- `Book` model: title*, author*, price (min 1), category, isAvailable (default true)
- `POST /books` 201 | `GET /books` 200 | `GET /books/:id` 200/404 | `PUT /books/:id` 200/400/404 | `DELETE /books/:id` 200/404
- Invalid input -> 400, not found -> 404, logger middleware prints method + URL, error-handling middleware included.

## Task 2 - Student Portal (JWT + roles)
```
cd file/student-portal
npm install
node ../A2.js          # server on port 3000
node ../A3.js          # runs all test scenarios and prints status + response
```
- `POST /register` - Joi validation, bcrypt hash, duplicate email rejected
- `POST /login` - returns JWT valid for 1 hour
- `authMiddleware` - reads `Authorization: Bearer <token>`, 401 if missing/invalid
- `GET /profile` - any logged-in user (no password in response)
- `GET /students` - admin only (others get 403)
- Security: `helmet`, `cors`, `express-rate-limit` (100 requests / 15 min)

## Screenshots
- `A1.png` - Task 1 endpoint tests (status codes + responses)
- `A2.png` - Task 2 register and login
- `A3.png` - Task 2 /profile with/without token, /students as student and admin
