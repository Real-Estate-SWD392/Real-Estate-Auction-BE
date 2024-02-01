module.exports = {
  delete: {
    tags: ["Product"],
    summary: "delete product",
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
    responses: {
      200: {
        description: "Success",
      },
    },
  },
};