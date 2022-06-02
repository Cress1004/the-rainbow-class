const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const httpLogger = require("http-logger");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

// const mongoose = require("mongoose");
// mongoose
//   .connect(config.mongoURI, { useNewUrlParser: true })
//   .then(() => console.log("DB connected"))
//   .catch(err => console.error(err));

const mongoose = require("mongoose");
const connect = mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

const corsOptions = {
  origin: [
    `https://the-rainbow-class-homepage.herokuapp.com`,
    `https://the-rainbow-class-client.herokuapp.com`,
  ],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());
app.use(httpLogger());

app.use("/api/common-data", require("./routes/commonDataRoute"));
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/classes", require("./routes/classRoute"));
app.use("/api/admin", require("./routes/adminRoute"));
app.use("/api/volunteers", require("./routes/volunteerRoute"));
app.use("/api/students", require("./routes/studentRoute"));
app.use("/api/upload", require("./routes/uploadRoute"));
app.use("/api/schedule", require("./routes/scheduleRoute"));
app.use("/api/cv", require("./routes/cvRoute"));
app.use("/api/notification", require("./routes/notificationRoute"));
app.use("/api/pairs", require("./routes/pairRoute"));
app.use("/api/reports", require("./routes/reportRoute"));
app.use("/api/questions", require("./routes/cvQuestionRoute"));

//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, "uploads")));
// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  // All the javascript and css files will be read and served from this folder
  app.use(express.static("../client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

server = app.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});

const sockets = require("./socket/socket");

sockets.init(server);
