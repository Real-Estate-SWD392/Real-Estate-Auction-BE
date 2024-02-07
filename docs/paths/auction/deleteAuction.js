module.exports = {
  delete: {
    tags: ["Auction"],
    summary: "delete auction",
    parameters: [
      {
        in: "path",
        name: "auctionID",
        security: [{ BearerAuth: [] }],
        description: "Auction ID",
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
    description: "Requires authentication with a bearer token.",
  },
};
