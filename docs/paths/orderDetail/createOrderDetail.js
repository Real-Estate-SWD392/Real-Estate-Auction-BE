module.exports = {
    post: {
      tags: ["orderDetail"],
      summary: "create orderDetail",
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
                    productID: {
                      type: "string",
                      format: "objectId",
                    },
                    orderID: {
                      type: "string",
                      format: "objectId",
                    },
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
                productID: "productid",
                orderID: "orderid",
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