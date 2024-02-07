const getAllAuction = require("./getAllAuction");
const deleteAuction = require("./deleteAuction");
module.exports = {
  "/auction": {
    ...getAllAuction,
  },
  "/auction/{auctionID}": {
    ...deleteAuction,
  },
};
