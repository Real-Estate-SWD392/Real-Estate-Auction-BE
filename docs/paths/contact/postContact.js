module.exports = {
    post: {
        tags: ["Contact"],
        summary: "Post Contact",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string",
                                example: "LyQuocLam",
                            },
                            email: {
                                type: "string",
                                example: "abc@gmail.com",
                            },
                            title: {
                                type: "string",
                                example: "title",
                            },
                            description: {
                                type: "string",
                                example: "description",
                            },
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
