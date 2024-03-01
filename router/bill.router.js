const express = require("express");
const { createBill, getBill } = require("../controller/bill.controller");

const router = express.Router();

router.post("/:memberID", createBill);

router.post("/getBill/:id", getBill);

module.exports = router;
