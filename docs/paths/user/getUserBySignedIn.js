module.exports = {
    get: {
      tags: ["User"],
      summary: "Return user profile information",
      responses: {
        200: {
          description: "Success",
        },
      },
      description: "Requires authentication with a bearer token.",
    },
  };