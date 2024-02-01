module.exports = {
  get: {
    tags: ["Auction"],
    summary: "get Auction by ID",
    parameters: [
      {
        in: "path",
        name: "auctionID",
        description: "ID of Auction",
        schema: {
          type: "string",
          format: "ObjectId",
        },
      },
    ],
    responses: {
      200: {
        description: "Success",
      },
    },
  },
};
