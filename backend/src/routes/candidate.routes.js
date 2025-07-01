import { Router } from 'express';
import verifyToken, { authorizeRoles } from '../middlewares/authMiddleware.js';
import { 
  addCandidate, 
  getAllCandidates, 
  getCandidateById, 
  updateCandidate, 
  deleteCandidate, 
  changeCandidateStatus,
  addInterview,
  addOffer,
  updateFinancial,
  getStatistics
} from '../controllers/candidate.controller.js';
import upload from '../middlewares/upload.js';
import { uploadCandidateCSV } from '../controllers/uploadCsvController.js';

const router = Router();

// Basic CRUD operations
router.post('/add-candidate', verifyToken, addCandidate);
router.get('/get-all-candidates', verifyToken, getAllCandidates);
router.get('/get-candidate-by-id/:candidateId', verifyToken, getCandidateById);
router.put('/update-candidate/:candidateId', verifyToken, updateCandidate);
router.delete('/delete-candidate/:candidateId', verifyToken, deleteCandidate);
router.put('/change-candidate-status/:candidateId', verifyToken, changeCandidateStatus);

// Additional operations
router.post('/:candidateId/interviews', verifyToken, addInterview);
router.post('/:candidateId/offers', verifyToken, addOffer);
router.put('/:candidateId/financial', verifyToken, updateFinancial);
router.get('/statistics', verifyToken, getStatistics);

// File upload
router.post("/upload-csv", upload.single("file"), uploadCandidateCSV);

export default router;
