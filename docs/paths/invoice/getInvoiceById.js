module.exports = {
    get: {
      tags: ["Invoice"],
      summary: "Return invoice by id",
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