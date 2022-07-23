const { CV } = require("../models/CV");

const sockets = {};

sockets.init = (server) => {
  // socket.io setup

  const io = require("socket.io")(server, {
    cors:
      process.env.NODE_ENV === "production"
        ? {
            origin: [
              process.env.AZURE_CLIENT_MANAGE_PAGE,
              process.env.AZURE_CLIENT_GUEST_PAGE,
            ],
            methods: ["GET", "POST", "FETCH"],
          }
        : {
            origin: [`http://localhost:3000`, `http://localhost:3001`],
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
