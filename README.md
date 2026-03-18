# DoConnect - Developer Q&A Platform

DoConnect is a full-stack MERN web application designed for developers to ask technical questions, share answers, and collaborate. It features a reputation system, thread moderation, and role-based access control.

## Features

* **Authentication & Security:** Secure login and registration using JWT (JSON Web Tokens).
* **Role-Based Access Control (RBAC):** Standard users can post and vote; administrators have dedicated dashboards to moderate, approve, close, or delete threads.
* **Interactive Q&A:** Users can post detailed questions with topic categorization, custom tags, and image attachments.
* **Community Voting:** Stack Overflow-style upvote and downvote system for questions and answers.
* **Discussion Threads:** Nested commenting system on individual answers.
* **Advanced Filtering:** Real-time search by title, tags, or topics, plus sorting by "Newest" or "Highest Score".
* **User Dashboard:** Dedicated profile page for users to track their asked questions, provided answers, and pending approval statuses.

## Tech Stack

* **Frontend:** React.js, React Router, React Bootstrap
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **File Uploads:** Multer (for image attachments)
* **Authentication:** bcryptjs, jsonwebtoken

---

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) installed
* [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string

### 1. Backend Setup

Open a terminal and navigate to the backend directory:
`cd backend`
`npm install`

Create a `.env` file in the root of the `backend` directory. You will need to add the following variables:
`PORT=5000`
`MONGO_URI=mongodb://127.0.0.1:27017/doconnect`
`JWT_SECRET=your_super_secret_jwt_key`
`ADMIN_EMAIL=admin@doconnect.com`

*(Note: Replace `MONGO_URI` with your Atlas connection string if you are not running MongoDB locally).*

Start the backend server:
`npm start`

The backend will run on `http://localhost:5000`.

### 2. Frontend Setup

Open a **new** terminal window and navigate to the frontend directory:
`cd frontend`
`npm install`

Start the React development server:
`npm start`

The application will open automatically in your browser at `http://localhost:3000`.

---

## Testing Admin Features

By default, new accounts are created as standard users. To test the admin panel and moderation features, you need to manually promote a user to an admin in the database:

1. Register a new account via the frontend `/register` page.
2. Open your database (using MongoDB Compass or the Mongo shell).
3. Navigate to the `users` collection and find your newly created user document.
4. Change the `role` field from `"user"` to `"admin"`.
5. Save the document. Log back into the frontend, and the Admin Panel will now be visible in the navigation bar.