module.exports = {
  put: {
    tags: ["User"],
    parameters: [
      {
        in: "path",
        name: "userId",
        description: "User ID",
        schema: {
          type: "string",
          format: "ObjectId",
        },
      },
    ],
    requestBody: {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                example: "dragoncute",
              },
              password: {
                type: "string",
                example: "Dragoncute!123",
              },
              phone: {
                type: "string",
                example: "0123456789",
              },
              address: {
                type: "string",
                example: "Hồ Chí Minh city",
              },
              image: {
                type: "string",
                format: "binary",
              },
              tax: {
                type: "string",
                example: "Mã số thuế",
              },
              status: {
                type: "string",
                example: "active or inactive",
              },
              role: {
                type: "array",
                items: {
                  type: "string",
                  enum: ["user", "admin", "company"],
                },
                default: ["user"],
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
