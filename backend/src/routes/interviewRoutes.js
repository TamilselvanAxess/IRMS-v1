// routes/statsRoutes.js
import express from "express";
import { 
  getInterviewStatistics, 
  getInterviewResultStats, 
} from "../controllers/interviewsController.js";


const router = express.Router();

// Interview routes
router.get("/stats/interviews", getInterviewStatistics);
router.get("/stats/interview-results", getInterviewResultStats);



export default router;