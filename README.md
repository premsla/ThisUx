# 💡 Idea Box

## Overview
**Idea Box** is a full-stack web application that allows users to capture, manage, and track ideas or project concepts. It offers login/signup functionality and full CRUD operations on ideas, with support for filtering by status or date.

## Objectives
- ✅ Full-stack: Frontend and Backend
- ✅ Authentication
- ✅ CRUD operations on ideas
- ✅ Filtering & sorting
- ✅ Optional hosting (Netlify / Vercel)

## Tech Stack

| Layer       | Tech Used                  |
|-------------|----------------------------|
| Frontend    | React, Tailwind CSS, Redux |
| Backend     | Node.js, Express.js        |
| Database    | MongoDB + Mongoose         |
| Auth        | JWT + bcryptjs             |
| Styling     | Tailwind CSS               |

## Features

### 🧑‍💼 Authentication
- Email/password signup and login
- JWT-based route protection

### 📝 Idea CRUD
- Add, edit, delete ideas
- Track ideas with title, description, and status

### 🗂 Filtering & Sorting
- Filter by idea status
- Color-coded tags

## Folder Structure

```
idea-box/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   ├── utils/
│   └── App.jsx / main.jsx
```

## API Endpoints

### Auth

| Method | Route             | Description        |
|--------|-------------------|--------------------|
| POST   | /api/auth/signup  | Register user      |
| POST   | /api/auth/login   | Login user         |

### Ideas

| Method | Route             | Description        |
|--------|-------------------|--------------------|
| GET    | /api/ideas        | Get all ideas      |
| POST   | /api/ideas        | Create new idea    |
| PUT    | /api/ideas/:id    | Update an idea     |
| DELETE | /api/ideas/:id    | Delete an idea     |

## Mongoose Schemas

### User

```js
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
});
```

### Idea

```js
const ideaSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ["New", "In Progress", "Done"], default: "New" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
```

## Environment Variables

`.env` (backend)

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## How to Run

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Author

**Premalatha P** – AI-DS Student  
GitHub: [@premalatha2506](https://github.com/premalatha2506)
