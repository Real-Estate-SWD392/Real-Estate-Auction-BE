module.exports = {
  post: {
    tags: ["Product"],
    summary: "create product",
    requestBody: {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              productName: {
                type: "string",
                example: "New Product"
              },
              status: {
                type: "string",
                example: "Active"
              },
              quantity: {
                type: "string",
                example: "10"
              },
              image: {
                type: "string",
                format: "binary",
                example: "product-image.jpg"
              },
              description: {
                type: "string",
                example: "Product description"
              },
              fullDescription: {
                type: "string",
                example: "Full product description"
              },
              price: {
                type: "string",
                example: "99.99"
              },
              discount: {
                type: "string",
                example: "10%"
              },
              offerEnd: {
                type: "string",
                example: "2023-06-30"
              },
              new: {
                type: "boolean",
                example: true
              },
              rating: {
                type: "string",
                example: "4.5"
              },
              category: {
                type: "string",
                example: "ghê1chan"
              },
            },
          },
          // example: {
          //   product: {
          //     productName: "New Product",
          //     status: "Active",
          //     quantity: "10",
          //     image: "product-image.jpg",
          //     description: "Product description",
          //     fullDescription: "Full product description",
          //     price: "99.99",
          //     discount: "10%",
          //     offerEnd: "2023-06-30",
          //     new: true,
          //     rating: "4.5",
          //     categoryID: "categoryid",
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