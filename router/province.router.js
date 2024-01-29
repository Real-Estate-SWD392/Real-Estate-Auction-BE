const express = require("express");
const { getProvinceByCityName } = require("../controller/province.controller");

const router = express.Router();

router.get("/district/:city", getProvinceByCityName);

module.exports = router;
