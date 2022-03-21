const mongoose = require("mongoose");
const { CV } = require("../models/CV");

const sockets = {};

sockets.init = (server) => {
  // socket.io setup
  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  console.log("Socket io init setup done");

  // client socket
  io.on("connection", (socket) => {
    // Push socket id and user information to array queue
    console.log(`Connected: ${socket.id}`);

    const pipeline = [
      {
        $match: {
          operationType: "insert",
        },
      },
    ];
    const changeStream = CV.watch(pipeline);
    changeStream.on("change", (change) => {
      io.to(socket.id).emit("new-cv-noti", change);
    });
  });
};

module.exports = sockets;
