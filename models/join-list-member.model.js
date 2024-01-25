const mongoose = require("mongoose");

const joinListMemberSchema = mongoose.Schema({
  memberID: {
    type: [{ type: mongoose.Types.ObjectId, ref: "Member" }],
    default: [],
  },
  auctionID: { type: mongoose.Types.ObjectId },
});

const joinListMemberModel = mongoose.model(
  "Join-List-Member",
  joinListMemberSchema
);

module.exports = joinListMemberModel;
