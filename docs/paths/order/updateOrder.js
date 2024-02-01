module.exports = {
  put: {
    tags: ["Order"],
    summary: "update information of order",
    parameters: [
      {
        in: "path",
        name: "orderID",
        description: "orderID",
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
              order: {
                type: "object",
                properties: {
                  shippingAddress: {
                    type: "string",
                  },
                  fullName: {
                    type: "string",
                  },
                  phone: {
                    type: "string",
                  },
                  note: {
                    type: "string",
                  },
                }
              },
            },
          },
          example: {
            order: {
              shippingAddress: "address",
              fullName: "levoanhduy",
              phone: "0912 ngày mai mới biết",
              note: "ship sang mỹ nhưng đừng lấy phí",
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