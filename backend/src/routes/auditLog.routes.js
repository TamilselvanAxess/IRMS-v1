
import express from 'express';
import { getAuditLogs, getAuditLogsByEntityId } from '../controllers/auditLog.controller.js';
import verifyToken from '../middlewares/authMiddleware.js';
const router = express.Router();


// Get audit logs for a specific entity
router.get(
  '/',
  verifyToken,
  getAuditLogs
);

// Get audit logs for a specific user
router.get(
  '/:candidateId',
  verifyToken,
  getAuditLogsByEntityId
);

export default router;
