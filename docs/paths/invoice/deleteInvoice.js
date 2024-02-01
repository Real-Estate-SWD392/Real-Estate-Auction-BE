module.exports = {
    delete: {
      tags: ["Invoice"],
      summary: "delete invoice",
      parameters: [
        {
          in: "path",
          name: "invoiceID",
          description: "invoiceID",
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