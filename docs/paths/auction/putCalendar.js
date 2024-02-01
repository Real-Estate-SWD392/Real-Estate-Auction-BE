module.exports = {
  put: {
    tags: ["Calendar"],
    summary: "Post Calendar",
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
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              dateTime: {
                type: "string",
                example: "10-10-2010",
              },
              local: {
                type: "string",
                example: "local",
              },
              description: {
                type: "string",
                example: "description",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Success",
      },
    },
  },
};
