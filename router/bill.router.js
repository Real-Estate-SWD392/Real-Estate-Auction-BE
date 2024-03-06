const express = require("express");
const { createBill, getBill } = require("../controller/bill.controller");
const { getBidListByMember } = require("../controller/member.controller");

const router = express.Router();

router.get("/member/:id", getBidListByMember);

router.post("/:memberID", createBill);

router.post("/getBill/:id", getBill);

module.exports = router;
