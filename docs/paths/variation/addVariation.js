module.exports = {
  post: {
    tags: ["variation"],
    summary: "create variation",
    requestBody: {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              image: {
                type: "string",
                format: "binary",
                exmaple: "imageurl"
              },
              color: {
                type: "string",
                exmaple: "red"
              },
              stock: {
                type: "number",
                exmaple: 10
              },
              productID: {
                type: "string",
                exmaple: "productid"
              },
            },
          },
          // example: {
          //   variation: {
          //     image: "imageurl",
          //     color: "red",
          //     stock: 10,
          //     productID: "productid",
          //   },
          // },
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