const mongoose = require('mongoose');

// To use config.env file
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

// Database connection
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

// Import app file
const app = require('./app');

// Server settings
const port = process.env.PORT; // || 3000
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Heroku config
process.on('SIGTERM', () => {
  console.log('🖐 SIGTERM RECEIVED. Shotting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
