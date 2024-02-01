module.exports = {
  get: {
    tags: ["Auction"],
    summary: "get All Auction",
    responses: {
      200: {
        description: "Success",
      },
    },
    description: "Requires authentication with a bearer token.",
  },
};
