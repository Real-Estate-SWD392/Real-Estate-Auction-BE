const { auctionModel } = require("../models/auction.model");

const io = require("socket.io")(5000, {
  cors: "http://localhost:3000/",
});

const connect = () => {
  try {
    io.on("connection", (socket) => {
      console.log("New client connected: ", socket.id);

      // Listen for new bids from clients
      socket.on("placeBid", async (newBid) => {
        console.log(newBid);

        // // // Broadcast the new bid to all connected clients
        io.emit("currentBid", newBid);
      });

      socket.on("buyNow", async (buy) => {
        console.log(buy);

        io.emit("currentAuction", buy);

        // // // Broadcast the new bid to all connected clients
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connect };
