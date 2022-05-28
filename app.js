require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

const home = require("./routes/home");
const user = require("./routes/user");
const schedule = require("./routes/schedule");

app.use("/api/v1", home);
app.use("/api/v1", user);
app.use("/api/v1", schedule);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("front/build"));
//   const path = require("path");
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "front", "build", "index.html"));
//   });
// }

module.exports = app;