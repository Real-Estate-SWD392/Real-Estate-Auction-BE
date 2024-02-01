module.exports = {
    get: {
      tags: ["Product"],
      summary: "Return product by name",
      parameters: [
        {
          in: "query",
          name: "productName",
          description: "productName",
          schema: {
            type: "String",
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