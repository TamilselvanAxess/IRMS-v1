// routes/statsRoutes.js
import express from "express";
import { 
  getOfferStats, 
  getOfferDetails 
} from "../controllers/offerController.js";

const router = express.Router();


// Offer routes
router.get("/offers", getOfferStats);
router.get("/offers/:date", getOfferDetails);

export default router;