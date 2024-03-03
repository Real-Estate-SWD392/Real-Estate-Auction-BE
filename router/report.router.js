const express = require("express");
const {
  getAllReport,
  handleReport,
} = require("../controller/report.controller");
const authorization = require("../utils/authorization");
const { STAFF_ROLE } = require("../constant/role");

const router = express.Router();

router.get("/", authorization([STAFF_ROLE]), getAllReport);
router.put("/:id", authorization([STAFF_ROLE]), handleReport);

module.exports = router;
