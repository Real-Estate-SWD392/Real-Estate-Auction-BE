module.exports = {
    delete: {
      tags: ["Contact"],
      summary: "delete Contact",
      parameters: [
        {
          in: "path",
          name: "contactId",
          security: [{ BearerAuth: [] }],
          description: "contact ID",
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