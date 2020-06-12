const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './config.env' });
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

//Read JSON files from
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf8')
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'));

//Import data to database

const importData = async () => {
  try {
    await Tour.create(tours);
    await Review.create(reviews);
    await User.create(users, { validateBeforeSave: false });
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//Delete all data from database collection

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
