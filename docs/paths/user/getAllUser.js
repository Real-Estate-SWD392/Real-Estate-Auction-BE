module.exports = {
  get: {
    tags: ["User"],
    summary: "Return all users",
    security: [{ BearerAuth: [] }],
    parameters: [
      {
        in: "query",
        name: "page",
        description: "Trang hiện tại",
        schema: {
          type: "String",
        },
      },{
        in: "query",
        name: "perPage",
        description: "Trên 1 trang có bao nhiu recording",
        schema: {
          type: "String",
        },
      },{
        in: "query",
        name: "name",
        description: "Tên người dùng",
        schema: {
          type: "String",
        },
      }
    ],
    responses: {
      200: {
        description: "Success",
      },
    },
  },
};
