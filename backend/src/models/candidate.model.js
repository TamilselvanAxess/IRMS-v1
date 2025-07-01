import mongoose from "mongoose";
import AuditLog from "./auditLog.model.js";

// Subdocument schemas for better organization
const addressSchema = new mongoose.Schema({
  permanent: String,
  current: String
}, { _id: false });

const contactSchema = new mongoose.Schema({
  father: {
    name: String,
    phone: String
  },
  mother: {
    name: String,
    phone: String
  },
  spouse: {
    name: String,
    phone: String
  }
}, { _id: false });

const educationSchema = new mongoose.Schema({
  sslc: String,
  hsc: String,
  ugDegree: String,
  ugMarksheet: String,
  ugProvisional: String,
  pgDegree: String
}, { _id: false });

const documentsSchema = new mongoose.Schema({
  eAadhar: String,
  panCard: String,
  photo: String,
  passport: String
}, { _id: false });

const trainingSchema = new mongoose.Schema({
  trainerName: String,
  trainerPhone: String,
  slotTime: String,
  classStartDate: Date,
  courseEndDate: Date,
  stage: {
    type: String,
    enum: ["training", "poc", "profileCreated", "projects"],
    default: "training"
  },
  stageUpdateDate: Date,
  trainingStageDate: Date,
  projectsStageDate: Date,
  pocStageDate: Date,
  profileCreatedStageDate: Date
}, { _id: false });

const profileSchema = new mongoose.Schema({
  videoShooted: {
    type: Boolean,
    default: false
  },
  videoShootedDate: Date,
  modelCreated: {
    type: Boolean,
    default: false
  },
  modelCreatedDate: Date,
  resumeCreated: {
    type: Boolean,
    default: false
  },
  resumeCreatedDate: Date,
  profileCreated: {
    type: Boolean,
    default: false
  },
  profileCreatedDate: Date
}, { _id: false });

const agreementSchema = new mongoose.Schema({
  signed: {
    type: Boolean,
    default: false
  },
  signedDate: Date,
  document: String
}, { _id: false });

const receiptSchema = new mongoose.Schema({
  created: {
    type: Boolean,
    default: false
  },
  createdDate: Date,
  document: String
}, { _id: false });

const paymentSplitSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  comment: String
}, { _id: false });

const interviewSchema = new mongoose.Schema({
  domain: String,
  interviewDateTime: Date,
  companyName: String,
  interviewLevel: String,
  interviewerName: String,
  proxyName: String,
  hrName: String,
  hrEmail: String,
  hrPhone: String,
  status: String,
  rescheduledDateTime: Date,
  statusRemarks: String,
  result: String,
  resultRemarks: String
}, { _id: false });

const offerSchema = new mongoose.Schema({
  offerLetterReceived: {
    type: Boolean,
    default: false
  },
  offerLetterReceivedDate: Date,
  offerLetterDoc: String,
  companyName: String,
  companyAddress: String,
  hrName: String,
  hrPhone: String,
  hrEmail: String,
  onboarded: {
    type: Boolean,
    default: false
  },
  onboardedDate: Date
}, { _id: false });

const loanSchema = new mongoose.Schema({
  loan: {
    type: Boolean,
    default: false
  },
  distributedAmount: Number,
  distributedDate: Date
}, { _id: false });

// Main candidate schema
const candidateSchema = new mongoose.Schema({
  // Basic Information
  candidateId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  fullName: {
    type: String,
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  phone: {
    type: String,
    required: true
  },
  
  // Addresses
  addresses: addressSchema,
  
  // Status and Category
  status: {
    type: String,
    enum: ["active", "inactive", "closed", "completed"],
    default: "active",
    index: true
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "unpaid"],
    default: "unpaid"
  },
  category: {
    type: String,
    enum: ["placement", "interview_support", "document_services", "course_only"],
    required: true,
    index: true
  },
  
  // Course Information
  course: {
    type: String,
    enum: ["software_development", "software_testing", "othersCourse"]
  },
  othersCourseName: String,
  
  // Inactive Information
  inactiveReason: String,
  inactiveDate: Date,
  comments: String,
  documentsNonSubmissionReason: String,
  
  // Agent Information
  agentName: String,
  joiningDate: Date,
  
  // Contact Information
  contacts: contactSchema,
  
  // Training Information
  training: trainingSchema,
  
  // Education Documents
  education: educationSchema,
  
  // Other Documents
  documents: documentsSchema,
  
  // Profile Status
  profile: profileSchema,
  
  // Agreements
  agreements: {
    entry: agreementSchema,
    jobOffer: agreementSchema,
    exit: agreementSchema
  },
  
  // Receipts
  receipts: {
    entry: receiptSchema,
    jobOffer: receiptSchema,
    exit: receiptSchema
  },
  
  // Financial Information
  financial: {
    totalAmount: Number,
    totalAmountReceived: Number,
    balanceAmount: Number,
    initialAmount: {
      type: Boolean,
      default: false
    },
    initialAmountSplits: [paymentSplitSchema],
    balanceAmountSplits: [paymentSplitSchema],
    balanceAmountSplitsPaid: [paymentSplitSchema],
    paymentForInterview: Number,
    paymentForInterviewDate: Date,
    paymentForDocuments: Number,
    paymentForDocumentsDate: Date,
    paymentForOffer: Number,
    paymentForOfferDate: Date
  },
  
  // Interviews
  interviews: [interviewSchema],
  
  // Offers
  offers: [offerSchema],
  
  // Loans
  loans: [loanSchema],
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  referredBy: String
}, {
  timestamps: true
});

// Indexes for better query performance
candidateSchema.index({ candidateId: 1, fullName: 1 });
candidateSchema.index({ status: 1, category: 1 });
candidateSchema.index({ joiningDate: 1 });
candidateSchema.index({ "training.stage": 1 });

// Audit logging middleware
candidateSchema.pre('findOneAndUpdate', async function(next) {
  try {
    const originalDoc = await this.model.findOne(this.getFilter());
    const updateData = this.getUpdate().$set || {};
    const updatedBy = updateData.updatedBy;

    if (!updatedBy) {
      console.warn('Warning: updatedBy field is missing in the update operation');
      return next();
    }
    
    // Track changes excluding metadata fields
    const excludedFields = ['updatedBy', 'updatedDate', 'updatedAt'];
    const changes = Object.keys(updateData)
      .filter(field => !excludedFields.includes(field))
      .filter(field => {
        const originalValue = originalDoc.get(field);
        const newValue = updateData[field];
        return JSON.stringify(originalValue) !== JSON.stringify(newValue);
      })
      .map(field => ({
        field,
        oldValue: originalDoc.get(field),
        newValue: updateData[field]
      }));

    if (changes.length > 0) {
      await AuditLog.create({
        entity: 'Candidate',
        entityId: originalDoc.candidateId,
        changes,
        changedBy: updatedBy
      });
    }

    next();
  } catch (error) {
    console.error('Audit log error:', error);
    next(error);
  }
});

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;
