module.exports = {
    get: {
      tags: ["variation"],
      summary: "Return variation by productID",
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