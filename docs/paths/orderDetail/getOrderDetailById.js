module.exports = {
    get: {
      tags: ["orderDetail"],
      summary: "Return order detail by id",
      parameters: [
        {
          in: "path",
          name: "orderDetailID",
          description: "orderDetailID",
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