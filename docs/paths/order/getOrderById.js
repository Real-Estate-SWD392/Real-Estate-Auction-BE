module.exports = {
  get: {
    tags: ["Order"],
    summary: "Return order by id",
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
    responses: {
      200: {
        description: "Success",
      },
    },
  },
};