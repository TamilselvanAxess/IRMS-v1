
import { Router } from 'express';
import verifyToken, { authorizeRoles } from '../middlewares/authMiddleware.js';
import { changeParticipantStatus, createParticipant, deleteParticipant, getParticipantById, getAllParticipants, updateParticipant, getParticipantByRole } from '../controllers/participantController.js';
const router = Router();

router.post('/create-participant',verifyToken, authorizeRoles("superadmin","admin"), createParticipant );
router.get('/get-all-participants',verifyToken, getAllParticipants);
router.get('/get-participant-by-id/:participantId',verifyToken, authorizeRoles("superadmin","admin"), getParticipantById);
router.get('/get-participant-by-role/:role',verifyToken, authorizeRoles("superadmin","admin"), getParticipantByRole);
router.put('/update-participant/:participantId',verifyToken, authorizeRoles("superadmin","admin"), updateParticipant);
router.delete('/delete-participant/:participantId',verifyToken, authorizeRoles("superadmin","admin"), deleteParticipant);
router.put('/change-participant-status/:participantId',verifyToken, authorizeRoles("superadmin","admin"), changeParticipantStatus);

export default router;
