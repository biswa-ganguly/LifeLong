import express from "express";
import { searchHospitalsByName } from "../services/searchHospital.js";

const router = express.Router();

router.get("/hospital/search", (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: "Query parameter 'name' is required" });
  }

  const results = searchHospitalsByName(name);
  res.json(results);
});

export default router;
