import express from "express";
import { searchPoliceStationsByName } from "../services/searchPoliceStations.js";

const router = express.Router();

router.get("/police/search", (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: "Query parameter 'name' is required" });
  }

  const results = searchPoliceStationsByName(name);
  res.json(results);
});

export default router;
