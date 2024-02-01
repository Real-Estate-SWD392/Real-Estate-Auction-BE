module.exports = {
  put: {
    tags: ["Product"],
    summary: "update information of Status product",
    parameters: [
      {
        in: "path",
        name: "productID",
        description: "productID",
        schema: {
          type: "String",
          format: "objectId",
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
              status: {
                type: "string",
                example: "Done",
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
