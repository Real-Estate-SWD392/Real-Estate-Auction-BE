module.exports = {
    delete: {
      tags: ["variation"],
      summary: "delete variation",
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
      responses: {
        200: {
          description: "Success",
        },
      },
    },
  };