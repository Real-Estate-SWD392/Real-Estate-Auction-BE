module.exports = {
  post: {
    tags: ["Auth"],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              firstName: {
                type: "string",
                example: "Son",
              },
              lastname: {
                type: "string",
                example: "Pham",
              },
              email: {
                type: "string",
                example: "dragoncute@gmail.com",
              },
              password: {
                type: "string",
                example: "Dragoncute!123",
              },
              phone: {
                type: "string",
                example: "0123456789",
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
