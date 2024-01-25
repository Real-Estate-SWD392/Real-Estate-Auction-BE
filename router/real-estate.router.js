const express = require("express");
const {
  getAllRealEstate,
  getRealEstateByID,
  getRealEstateByStatus,
  uploadPDF,
  uploadImages,
  getRealEstateByType,
  createNewRealEstate,
  getRealEstateByOwner,
  updateRealEstate,
} = require("../controller/real-estate.controller");

const router = express.Router();

router.get("/", getAllRealEstate);
router.get("/:id", getRealEstateByID);
router.get("/owner/:ownerID", getRealEstateByOwner);
router.get("/status/:status", getRealEstateByStatus);
router.get("/type/:type", getRealEstateByType);

router.post("/", createNewRealEstate);

router.put("/", updateRealEstate);

// UPLOAD PDF AND IMAGE
router.post("/uploadPDF", uploadPDF);
router.post("/uploadImages", uploadImages);

module.exports = router;
