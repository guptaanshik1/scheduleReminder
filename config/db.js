const mongoose = require("mongoose");

const connectWithDb = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("Connection with Database successfully done...."))
    .catch((error) => {
      console.log(`Error connecting to the database: ${error}`);
      process.exit(1);
    });
};

module.exports = connectWithDb;