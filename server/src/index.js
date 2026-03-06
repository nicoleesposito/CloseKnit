/* serves as the entry point to the backend.
starts the express server, loads middleware, connects to the database (db.js), loads routes, and handles any errors */

/* eslint-env node */
/* global require, process */

/* Entry point of the backend server */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const circleRoutes = require('./routes/circles');
const journalRoutes = require('./routes/journal');
const calendarRoutes = require('./routes/calendar');
const memoryBoardRoutes = require('./routes/memoryboard');
const activityRoutes = require('./routes/activity');

const app = express();
const PORT = process.env.PORT || 5000;


// function runs between the request and response before reaching a route
// middleware docs: https://expressjs.com/en/guide/writing-middleware.html
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());


// routes that run with express server
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/circles', circleRoutes);
app.use('/api/circles/:circleId/journal', journalRoutes);
app.use('/api/circles/:circleId/calendar', calendarRoutes);
app.use('/api/circles/:circleId/memoryboard', memoryBoardRoutes);
app.use('/api/circles/:circleId/activity', activityRoutes);


// error handling, important for routes and confirming everything is good
app.use(errorHandler);


// start server connection to the databse
async function startServer() {

  try {

    await connectDB();
    console.log('MongoDB connected');

    app.listen(PORT, function () {
      console.log('Server running on port ' + PORT);
    });

  } catch (error) {

    console.log('Database connection failed');
    console.log(error.message);
    process.exit(1);

  }

}

startServer();