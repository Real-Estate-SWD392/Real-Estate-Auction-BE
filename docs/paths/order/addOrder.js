module.exports = {
  post: {
    tags: ["Order"],
    summary: "create order",
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
                  // date: {
                  //   type: "string",
                  //   format: "date-time",
                  //   description: "Date of the order in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)",
                  // },
                },
              },
            },
          },
          example: {
            order: {
              shippingAddress: "address",
              fullName: "levoanhduy",
              phone: "0912 ngày mai mới biết",
              note: "ship sang mỹ nhưng đừng lấy phí",
              // date: "2023-10-13T00:00:00.000Z",
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