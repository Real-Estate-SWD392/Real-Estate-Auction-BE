module.exports = {
  delete: {
    tags: ["Calendar"],
    summary: "delete Calendar",
    parameters: [
      {
        in: "path",
        name: "calendarId",
        security: [{ BearerAuth: [] }],
        description: "calendar ID",
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
