module.exports = {
    post: {
      tags: ["Invoice"],
      summary: "create invoice",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                invoice: {
                  type: "object",
                  properties: {
                    orderDetailID: {
                      type: "string",
                      format: "objectId",
                    },
                    paymentID: {
                        type: "string",
                        format: "objectId",
                      },
                  },
                },
              },
            },
            example: {
              invoice: {
                orderDetailID: "id123",
                paymentID:"id123"
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