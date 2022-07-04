const { CV } = require("../models/CV");

const sockets = {};

sockets.init = (server) => {
  // socket.io setup
  const io = require("socket.io")(server, {
    cors: {
      origin: "https://the-rainbow-class-client.herokuapp.com",
      methods: ["GET", "POST", "FETCH"],
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
