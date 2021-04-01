const app = require('./app');
const mongoose = require('mongoose');
const Jobs = require('./models/jobsModel');
const schedule = require('node-schedule');
const scrapping = require('./public/jobscraper');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

//cron job to schedule web scrapping
//setup cron job to schedule webscrapping every 30 minutes
schedule.scheduleJob('30 * * * *', async() => {
  await scrapping()
  
});


//reset job data
schedule.scheduleJob('0 0 * * *', async () => {
  try {
    await Jobs.deleteMany();
    console.log('Deleted successfully');
    await scrapping()
  } catch (err) {
    console.log(err);
  }
});

//start the server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

//handle unhandled rejection
process.on('unhandledRejection', (err) => {
  console.log('unhandled rejection error ');
  console.log(err);

  server.close(() => {
    process.exit(1);
  });
});

//handle uncaught exception error
process.on('uncaughtException', (err) => {
  console.log('uncaught exception error ');
  console.log(err);

  server.close(() => {
    process.exit(1);
  });
});

//Database connection
const DB = process.env.DB.replace('<password>', process.env.DB_PASS);

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Database connected successfully ');
  });
