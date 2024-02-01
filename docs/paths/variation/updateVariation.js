module.exports = {
  put: {
    tags: ["variation"],
    summary: "update variation",
    parameters: [
      {
        in: "path",
        name: "variationID",
        description: "variationID",
        schema: {
          type: "String",
          format: "objectId",
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
              image: {
                type: "string",
                format: "binary",
                exmaple: "imageurl",
              },
              color: {
                type: "string",
                exmaple: "red",
              },
              stock: {
                type: "number",
                exmaple: 10,
              },
            },
          },
          // example: {
          //   variation: {
          //     image: "imageurl",
          //     color: "red",
          //     stock: 10,
          //   },
          // },
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