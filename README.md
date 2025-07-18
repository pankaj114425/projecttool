Project Management Tool
A full-stack project management app with user login and complete functionality to create, update, and delete both projects and tasks.
1. Backend Setup

cd server - Navigate to your backend project directory.
npm init - Initializes a new Node.js project with default values (package.json file will be created).

Install required package
npm install express cors bcrypt moongose dotenv
express -A minimal and flexible Node.js web application framework used to build APIs.
cors -Enables Cross-Origin Resource Sharing (allows frontend to connect to backend).
bcrypt -Library to hash and compare user passwords securely.
mongoose -MongoDB object modeling tool – helps interact with MongoDB using schemas.
dotenv - used for loading enviroment varible from env file.

.env
.env file stores environmental variables in KEY=VALUE format. These variables are loaded into your Node.js app using the dotenv package.
PORT=8080 -The port your Express server will run on
MONGO_URI='connection string' -Your MongoDB connection string (local or Atlas URL)
JWT_SECRET=your_jwt_secret_key_here -A private key used to sign and verify JWT tokens. Keep this secret!

Command:
npm run server For running the server

Seed.js

The seed.js file contains logic to automatically create a test user with the email test@example.com and password Test@123. It first checks if this user already exists in the database—if so, it proceeds without creating a duplicate. If the user does not exist, it creates the user and then automatically adds two projects associated with that user. Each project is also populated with three tasks. This script is useful for generating dummy data to quickly test the application's functionality.

Command

npm run seed for running the seed script.

2. Frontend setup

npx create-vite@latest client -Initializes a fast React project using Vite in a folder named client.
cd client
npm install - Installs all required packages listed in package.json.

npm install react-router-dom axios react-toastify -Adds routing, API communication, and toast notification support.

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
Installs Tailwind CSS and sets up config files (tailwind.config.js and postcss.config.js).

3. Features list

- User Authentication
  Register and login functionality using email and password

JWT-based authentication system

Passwords hashed securely with bcrypt

- Project Management
  Create, update, and delete projects
  View all projects created by the logged-in user
  search the project by title,filter projects by status
  Project fields: title, description, status ("active", "completed")

- Task Management
  Tasks are linked to individual projects
  Full CRUD operations on tasks
  Task fields: title, description, status ("todo", "in-progress", "done"), due date
  search the task by title,filter task by status

- Seed Script
  Adds one default user:
  Email: test@example.com
  Password: Test@123
  Automatically creates 2 projects for this user
  Each project is populated with 3 dummy tasks
  Seed script can be run via npm run seed

- Frontend Features
  Login and registration pages
  Dashboard displaying user’s projects
  Individual project pages with task listings
  Add/edit forms for both projects and tasks
  Styled using Tailwind CSS

- Developer Features
  Modular file structure
  RESTful API design
  Reusable components
  Axios used for API calls

- Known Limitations
  No role-based access (admin/user) – only basic user functionality
  No email verification or password reset functionality
