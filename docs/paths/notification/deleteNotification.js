module.exports = {
  delete: {
    tags: ["Notification"],
    summary: "delete Notification",
    parameters: [
      {
        in: "path",
        name: "notificationId",
        security: [{ BearerAuth: [] }],
        description: "Notification ID",
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
