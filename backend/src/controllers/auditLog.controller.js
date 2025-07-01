
import AuditLog from "../models/auditLog.model.js";

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().populate('changedBy', 'fullName email'); // Show user info
    res.status(200).json({message: "Audit logs fetched successfully", logs});
  } catch (error) {
    res.status(500).json({ message: "Error fetching audit logs", error });
  }
};

export const getAuditLogsByEntityId = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const logs = await AuditLog.find({ entityId: candidateId }).populate('changedBy', 'fullName email').sort({ changedAt: -1 });
      res.status(200).json({message: "Audit logs fetched successfully", logs});
  } catch (error) {
    res.status(500).json({ message: "Error fetching audit logs", error });
  }
};