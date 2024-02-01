module.exports = {
    post: {
      tags: ["Auth"],
      summary: "Sign out user",
      responses: {
        200: {
          description: "Success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Sign out success!",
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  
  
  
  
  
  