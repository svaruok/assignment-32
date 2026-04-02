# 3W – Full Stack Internship Assignment

Mini social post application built as **Task 1** of the 3W Full Stack Internship. The goal is to recreate a lightweight version of the **TaskPlanet Social** page with a clean, mobile‑first experience.

This README focuses on:
- What the app does
- How the codebase is organised
- How to run it locally and deploy it

For the official problem statement and submission form, refer to the document shared by 3W (this repo does **not** duplicate that text).

---

## 1. Overview

**Purpose**

Allow users to:
- Sign up and log in with email + password
- Create posts with text and/or image
- Browse a public feed of posts from all users
- Like and comment on posts with instant UI feedback

**High‑level design**

- **Frontend:** React.js SPA styled with Material UI, strongly inspired by the TaskPlanet Social page (rounded cards, blue accent, mobile‑first layout).
- **Backend:** Node.js + Express REST API using MongoDB via Mongoose.
- **Database:** MongoDB Atlas with exactly **two collections**: `users` and `posts`.

---

## 2. Project Structure

```text
Task/
  frontend/   # React client (Social screen, auth, feed, composer)
  backend/    # Express API (auth, posts, likes, comments)
  README.md
  .gitignore
```

- `frontend/`
  - React + React Router
  - Material UI components
  - Pages: Login, Signup, Feed
  - Components: Navbar, CreatePost, PostCard, FeedTabs, BottomNav, CommentModal

- `backend/`
  - Express server with modular routes (`/api/auth`, `/api/posts`)
  - Mongoose models for `User` and `Post`
  - JWT auth middleware

This matches the “separate frontend and backend folders in a single repository” requirement.

---

## 3. Core Features

### 3.1 Authentication

- Email + password **signup** and **login**
- Passwords hashed with **bcryptjs**
- JWT issued on successful auth and stored in `localStorage`
- Protected feed route – users without a token are redirected to login

### 3.2 Posting

- Authenticated user can create a post with:
  - Text only
  - Image only
  - Or both
- Validation ensures at least one of text or image is present
- Posts store:
  - Author reference
  - Text
  - Image (base64 string from upload)
  - Timestamp

### 3.3 Feed

- Public feed shows posts from all users (reverse chronological)
- Each card shows:
  - Avatar with initials
  - Username + handle
  - Created time
  - Text and optional image
  - Like + comment counts

### 3.4 Likes and Comments

- Users can like/unlike posts
- Likes stored as an array of user IDs on the post
- Comments store:
  - Commenter userId + username
  - Comment text
  - Created timestamp
- UI updates optimistically so feedback feels instant

---

## 4. Tech Stack

**Frontend**
- React (Create React App)
- React Router DOM
- Material UI (MUI)
- react-hot-toast for toast notifications

**Backend**
- Node.js, Express
- Mongoose (MongoDB ODM)
- JSON Web Token (JWT)
- bcryptjs for password hashing

**Database**
- MongoDB Atlas (recommended hosting)

**Styling**
- Material UI theme + small custom CSS
- No TailwindCSS (per assignment rules)

---

## 5. Running the Project Locally

### 5.1 Prerequisites

- Node.js LTS
- npm
- MongoDB Atlas connection string

### 5.2 Backend (Express + MongoDB)

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
CLIENT_URL=http://localhost:3000
```

Start the server:

```bash
npm run dev   # with nodemon
# or
npm start
```

Backend runs on `http://localhost:5000` by default.

### 5.3 Frontend (React + MUI)

```bash
cd frontend
npm install
npm start
```

The React app runs on `http://localhost:3000` and talks to the backend via `/api/auth` and `/api/posts` endpoints.

For deployment, set `REACT_APP_API_URL` in your frontend environment to the deployed backend URL, for example:

```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

---

## 6. Data Model

Only two collections are used, as required.

### 6.1 users

- `_id`
- `username`
- `email`
- `passwordHash`
- `createdAt`

### 6.2 posts

- `_id`
- `userId` (ref → users)
- `text`
- `image`
- `likes` (array of user IDs)
- `comments` (array of `{ userId, username, text, createdAt }`)
- `createdAt`

---

## 7. UI & UX Notes

- Visual style inspired by the **TaskPlanet Social** page:
  - Rounded cards and buttons
  - Soft shadows
  - Blue primary colour
  - Bottom navigation and floating action button on the main Social screen
- Designed **mobile‑first**, then scaled up to tablet/desktop:
  - Header, create‑post composer, feed tabs, and post cards all have responsive rules
  - No TailwindCSS; only MUI and small CSS tweaks

---

## 8. Deployment (Suggested Setup)

These steps match the recommended stack in the assignment.

### Frontend – Vercel or Netlify

```bash
cd frontend
npm run build
```

Deploy the generated `build/` folder to Vercel or Netlify.

### Backend – Render

1. Push this repo to GitHub.
2. On Render, create a Web Service from the `backend/` folder.
3. Configure environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`).
4. Use `npm start` as the start command.

### Database – MongoDB Atlas

- Host the MongoDB cluster on Atlas and plug its URI into `backend/.env`.

---

## 9. Assignment Alignment (Quick Checklist)

- [x] Email/password signup and login
- [x] User data stored in MongoDB `users`
- [x] Posts stored in MongoDB `posts`
- [x] Create post with text and/or image
- [x] Public feed showing all posts
- [x] Like and comment support with usernames tracked
- [x] React frontend + Node.js/Express backend + MongoDB
- [x] Separate `frontend/` and `backend/` folders
- [x] TaskPlanet‑inspired, responsive UI

---

This repository is intended solely as the implementation of **Task 1 – Mini Social Post Application** for the 3W Full Stack Internship. For submission links, deadlines, and any clarifications, please refer to the official assignment document from 3W.
