module.exports = {
    delete: {
      tags: ["orderDetail"],
      summary: "delete orderDetaiil",
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