# DoConnect - Developer Q&A Platform

DoConnect is a full-stack MERN web application designed for developers to ask technical questions, share answers, and collaborate in real-time. It features a robust reputation system, live direct messaging, automated email notifications, and comprehensive role-based access control for community moderation.

## Features

* **Authentication & Security:** Secure login and registration using JWT (JSON Web Tokens) and bcrypt password hashing.
* **Role-Based Access Control (RBAC):** Standard users can post, vote, and chat. Administrators have a dedicated command center to approve, reject, close, and archive threads, as well as manage user access.
* **Real-Time Live Chat:** Integrated WebSockets (Socket.io) enable instant messaging between users, featuring online presence indicators, live typing statuses, and unread message badges.
* **Automated Email Alerts:** Backend Nodemailer integration automatically notifies administrators of new pending questions and answers requiring moderation.
* **Interactive Q&A:** Users can post detailed questions with topic categorization, custom tags, and image attachments. Long-form content is automatically truncated with professional "Read More" toggles.
* **Community Voting:** Stack Overflow-style upvote and downvote system for questions, alongside a "Like" system for individual answers.
* **Discussion Threads:** Nested commenting system on individual answers for detailed technical clarification.
* **Advanced Filtering:** Real-time search by title, tags, or topics, plus sorting capabilities.

## Tech Stack

* **Frontend:** React.js, React Router, React Bootstrap, Socket.io-client
* **Backend:** Node.js, Express.js, Socket.io
* **Database:** MongoDB, Mongoose
* **Utilities:** Multer (File Uploads), Nodemailer (SMTP Email Services)

---

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) installed
* [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string

### 1. Backend Setup

Open a terminal and navigate to the backend directory to install the necessary dependencies:

    cd backend
    npm install

Create a `.env` file in the root of the `backend` directory. You will need to configure your database, authentication secret, and email provider settings:

    PORT=5000
    MONGO_URI=mongodb://127.0.0.1:27017/doconnect
    JWT_SECRET=your_super_secret_jwt_key

    # Email Notification Configuration (Nodemailer)
    EMAIL_USER=your_bot_account@gmail.com
    EMAIL_PASS=your_16_letter_google_app_password
    ADMIN_EMAIL=your_personal_email@gmail.com

*(Note: Replace `MONGO_URI` with your Atlas connection string if you are not running MongoDB locally. If using Gmail, `EMAIL_PASS` must be a generated App Password, not your standard account password).*

Start the backend server:

    npm start

The backend API and WebSocket server will run on `http://localhost:5000`.

### 2. Frontend Setup

Open a **new** terminal window and navigate to the frontend directory to install the React dependencies:

    cd frontend
    npm install

Start the React development server:

    npm start

The application will open automatically in your browser at `http://localhost:3000`.

---

## Testing Admin Features

By default, new accounts are created as standard users. To test the Admin Dashboard, Audit Archives, and Moderation queues, you must manually promote a user to an admin:

1. Register a new account via the frontend `/register` page.
2. Open your database (using MongoDB Compass or the Mongo shell).
3. Navigate to the `users` collection and find your newly created user document.
4. Change the `role` field from `"user"` to `"admin"`.
5. Save the document. Log back into the frontend, and the Admin Panel will now be visible in the primary navigation sidebar.

---

## Current Status & Roadmap

**Status: Active Development**

The core Minimum Viable Product (MVP) is fully functional and stable, meeting all foundational requirements for secure authentication, role-based moderation, and real-time communication. 

As part of a continuous integration and continuous delivery (CI/CD) approach, this repository remains under active development. The architecture has been built to scale, and several new features and UI/UX refinements are currently in the pipeline for future release:

* **Rich Text Editing:** Implementing Markdown or WYSIWYG editors for question and answer bodies to support code block formatting.
* **Enhanced User Profiles:** Adding user avatars, reputation tier badges, and historical contribution graphs.
* **Advanced Moderation Analytics:** Expanding the Admin Dashboard to include data visualization for daily active users, resolved thread ratios, and platform engagement metrics.
* **Notification Center:** A frontend notification bell to alert users of replies and upvotes without requiring email routing.