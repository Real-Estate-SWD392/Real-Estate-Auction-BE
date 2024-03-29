require("dotenv").config();

module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Express API for JSONPlaceholder",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express. It retrieves data from JSONPlaceholder.",
    license: {
      name: "Licensed Under MIT",
      url: "https://github.com/tranquoclong",
    },
    contact: {
      name: "DRAGONCUTE",
      url: "https://github.com/tranquoclong",
    },
  },
  // schemes:[ "http" ,"https"],
  servers: [
    {
      url: "https://real-estate-auction-be.onrender.com",
      description:
        process.env.NODE_ENV === "development"
          ? "Development server"
          : "Production server",
    },
    {
      url: "http://localhost:8080/",
      description:
        process.env.NODE_ENV === "development"
          ? "Development local"
          : "Production local",
    },
  ],
  security: [{ BearerAuth: [] }],
};
