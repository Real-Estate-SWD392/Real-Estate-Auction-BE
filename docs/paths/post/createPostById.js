module.exports = {
  post: {
    tags: ["Post"],
    summary: "Create post",
    security: [{ BearerAuth: [] }],
    parameters: [
      {
        in: "path",
        name: "userId",
        description: "userId ID",
        schema: {
          type: "String",
        },
      },
    ],
    requestBody: {
      required: true,
      content: {
        
      },
    },
    responses: {
      200: {
        description: "Success",
      },
    },
  },
};
