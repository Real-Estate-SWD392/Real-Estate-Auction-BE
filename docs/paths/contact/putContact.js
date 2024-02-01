module.exports = {
  put: {
    tags: ["Contact"],
    summary: "Put Contact",
    parameters: [
      {
        in: "path",
        name: "contactId",
        security: [{ BearerAuth: [] }],
        description: "Contact ID",
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
              subject: {
                type: "string",
                example: "subject",
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