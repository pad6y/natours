const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception. Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

// console.log(process.env);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  //Need to setup local in config.env for local DB connection
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connections successful!'));

//START SERVER
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`natours serving v1 is running on: ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection. Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// console.log(x);
