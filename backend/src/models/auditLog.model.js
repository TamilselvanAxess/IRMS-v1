// import mongoose, { Schema } from 'mongoose';

// const auditLogSchema = new Schema({
//   entityId: { 
//     // type: Schema.Types.ObjectId,
//     type: String,
//     required: true,
//     index: true 
//   },
//   entityType: { 
//     type: String, 
//     required: true,
//     index: true
//   },
//   changeType: { 
//     type: String, 
//     enum: ['UPDATE', 'CREATE', 'DELETE'], 
//     required: true 
//   },
//   changes: [{
//     field: { type: String, required: true },
//     oldValue: { type: Schema.Types.Mixed },
//     newValue: { type: Schema.Types.Mixed }
//   }],
//   updatedBy: { 
//     type: Schema.Types.ObjectId,
//     ref: 'User', 
//     required: true,
//     index: true
//   },
//   updatedAt: { 
//     type: Date, 
//     default: Date.now,
//     index: true
//   }
// }, {
//   timestamps: true // Adds createdAt and updatedAt timestamps
// });

// // Add compound index for common queries
// auditLogSchema.index({ entityId: 1, updatedAt: -1 });

// export const AuditLog = mongoose.model('AuditLog', auditLogSchema);

import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  entity: { type: String, required: true }, // Collection name (e.g., "Employee")
  entityId: { type: String, required: true }, // Document ID
  changes: [
    {
      field: { type: String, required: true }, // Field that changed
      oldValue: mongoose.Schema.Types.Mixed, // Previous value
      newValue: mongoose.Schema.Types.Mixed  // New value
    }
  ],
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who changed it?
  changedAt: { type: Date, default: Date.now } // When the change happened
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;