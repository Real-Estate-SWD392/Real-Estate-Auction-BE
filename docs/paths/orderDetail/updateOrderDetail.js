module.exports = {
    put: {
      tags: ["orderDetail"],
      summary: "update orderDetail",
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
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                orderDetail: {
                  type: "object",
                  properties: {
                    deposit: {
                      type: "string",
                    },
                    shipPrice: {
                      type: "number",
                    },
                    quantity: {
                      type: "number",
                    },
                    status: {
                      type: "string",
                    },
                  },
                },
              },
            },
            example: {
              orderDetail: {
                deposit: "50%",
                shipPrice: 10.5,
                quantity: 2,
                status: "pending",
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