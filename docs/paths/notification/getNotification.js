module.exports = {
  get: {
    tags: ["Notification"],
    summary: "get Notification",
    parameters: [
      {
        in: "path",
        name: "userId",
        security: [{ BearerAuth: [] }],
        description: "User ID",
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
