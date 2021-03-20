// const app = require('./app');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

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
