import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Candidate from '../models/candidate.model.js';

dotenv.config();

/**
 * Migration script to update existing candidate data to new schema structure
 */
async function migrateCandidateData() {
  try {
    console.log('🔄 Starting data migration...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Get all candidates
    const candidates = await Candidate.find({});
    console.log(`📊 Found ${candidates.length} candidates to migrate`);
    
    let migratedCount = 0;
    let errorCount = 0;
    
    for (const candidate of candidates) {
      try {
        const updateData = {};
        
        // Migrate addresses
        if (candidate.permanentAddress || candidate.currentAddress) {
          updateData.addresses = {
            permanent: candidate.permanentAddress || '',
            current: candidate.currentAddress || ''
          };
        }
        
        // Migrate contacts
        if (candidate.fatherName || candidate.fatherPhone || 
            candidate.motherName || candidate.motherPhone ||
            candidate.spouseName || candidate.spousePhone) {
          updateData.contacts = {
            father: {
              name: candidate.fatherName || '',
              phone: candidate.fatherPhone || ''
            },
            mother: {
              name: candidate.motherName || '',
              phone: candidate.motherPhone || ''
            },
            spouse: {
              name: candidate.spouseName || '',
              phone: candidate.spousePhone || ''
            }
          };
        }
        
        // Migrate education documents
        if (candidate.sslc || candidate.hsc || candidate.ugDegreeCertificate ||
            candidate.ugConsolidatedMarksheet || candidate.ugProvisionalCertificate ||
            candidate.pgDegreeCertificate) {
          updateData.education = {
            sslc: candidate.sslc || '',
            hsc: candidate.hsc || '',
            ugDegree: candidate.ugDegreeCertificate || '',
            ugMarksheet: candidate.ugConsolidatedMarksheet || '',
            ugProvisional: candidate.ugProvisionalCertificate || '',
            pgDegree: candidate.pgDegreeCertificate || ''
          };
        }
        
        // Migrate other documents
        if (candidate.eAadhar || candidate.panCard || candidate.photo || candidate.passport) {
          updateData.documents = {
            eAadhar: candidate.eAadhar || '',
            panCard: candidate.panCard || '',
            photo: candidate.photo || '',
            passport: candidate.passport || ''
          };
        }
        
        // Migrate training information
        if (candidate.trainerName || candidate.trainerPhone || candidate.slotTime ||
            candidate.classStartDate || candidate.courseEndDate || candidate.stage) {
          updateData.training = {
            trainerName: candidate.trainerName || '',
            trainerPhone: candidate.trainerPhone || '',
            slotTime: candidate.slotTime || '',
            classStartDate: candidate.classStartDate || null,
            courseEndDate: candidate.courseEndDate || null,
            stage: candidate.stage || 'training',
            stageUpdateDate: candidate.stageUpdateDate || null,
            trainingStageDate: candidate.trainingStageDate || null,
            projectsStageDate: candidate.projectsStageDate || null,
            pocStageDate: candidate.pocStageDate || null,
            profileCreatedStageDate: candidate.profileCreatedStageDate || null
          };
        }
        
        // Migrate profile status
        if (candidate.resumeCreated || candidate.profileCreated || 
            candidate.videoShooted || candidate.modelCreated) {
          updateData.profile = {
            videoShooted: candidate.videoShooted || false,
            videoShootedDate: candidate.videoShootedDate || null,
            modelCreated: candidate.modelCreated || false,
            modelCreatedDate: candidate.modelCreatedDate || null,
            resumeCreated: candidate.resumeCreated || false,
            resumeCreatedDate: candidate.resumeCreatedDate || null,
            profileCreated: candidate.profileCreated || false,
            profileCreatedDate: candidate.profileCreatedDate || null
          };
        }
        
        // Migrate agreements
        if (candidate.entryAgreementSigned || candidate.jobOfferAgreementSigned || 
            candidate.exitAgreementSigned) {
          updateData.agreements = {
            entry: {
              signed: candidate.entryAgreementSigned || false,
              signedDate: candidate.entryAgreementSignedDate || null,
              document: candidate.entryAgreementDoc || ''
            },
            jobOffer: {
              signed: candidate.jobOfferAgreementSigned || false,
              signedDate: candidate.jobOfferAgreementSignedDate || null,
              document: candidate.jobOfferAgreementDoc || ''
            },
            exit: {
              signed: candidate.exitAgreementSigned || false,
              signedDate: candidate.exitAgreementSignedDate || null,
              document: candidate.exitAgreementDoc || ''
            }
          };
        }
        
        // Migrate receipts
        if (candidate.entryReceiptCreated || candidate.jobOfferReceiptCreated || 
            candidate.exitReceiptCreated) {
          updateData.receipts = {
            entry: {
              created: candidate.entryReceiptCreated || false,
              createdDate: candidate.entryReceiptCreatedDate || null,
              document: candidate.entryReceiptDoc || ''
            },
            jobOffer: {
              created: candidate.jobOfferReceiptCreated || false,
              createdDate: candidate.jobOfferReceiptCreatedDate || null,
              document: candidate.jobOfferReceiptDoc || ''
            },
            exit: {
              created: candidate.exitReceiptCreated || false,
              createdDate: candidate.exitReceiptCreatedDate || null,
              document: candidate.exitReceiptDoc || ''
            }
          };
        }
        
        // Migrate financial information
        if (candidate.totalAmount || candidate.totalAmountReceived || candidate.balanceAmount ||
            candidate.initialAmountSplited || candidate.balanceAmountSplits || 
            candidate.balanceAmountSplitsPaid) {
          updateData.financial = {
            totalAmount: candidate.totalAmount || 0,
            totalAmountReceived: candidate.totalAmountReceived || 0,
            balanceAmount: candidate.balanceAmount || 0,
            initialAmount: candidate.initialAmount || false,
            initialAmountSplits: candidate.initialAmountSplited || [],
            balanceAmountSplits: candidate.balanceAmountSplits || [],
            balanceAmountSplitsPaid: candidate.balanceAmountSplitsPaid || [],
            paymentForInterview: candidate.paymentForInterview || 0,
            paymentForInterviewDate: candidate.paymentForInterviewDate || null,
            paymentForDocuments: candidate.paymentForDocuments || 0,
            paymentForDocumentsDate: candidate.paymentForDocumentsDate || null,
            paymentForOffer: candidate.paymentForOffer || 0,
            paymentForOfferDate: candidate.paymentForOfferDate || null
          };
        }
        
        // Migrate loans
        if (candidate.loan && Array.isArray(candidate.loan)) {
          updateData.loans = candidate.loan.map(loan => ({
            loan: loan.loan || false,
            distributedAmount: loan.loanDistrubutedAmount || 0,
            distributedDate: loan.loanDistrubutedDate || null
          }));
        }
        
        // Update candidate if there are changes
        if (Object.keys(updateData).length > 0) {
          await Candidate.findByIdAndUpdate(candidate._id, updateData, { new: true });
          migratedCount++;
          console.log(`✅ Migrated candidate: ${candidate.candidateId}`);
        } else {
          console.log(`⏭️  No migration needed for candidate: ${candidate.candidateId}`);
        }
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error migrating candidate ${candidate.candidateId}:`, error.message);
      }
    }
    
    console.log('\n📈 Migration Summary:');
    console.log(`✅ Successfully migrated: ${migratedCount} candidates`);
    console.log(`❌ Errors: ${errorCount} candidates`);
    console.log(`📊 Total processed: ${candidates.length} candidates`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateCandidateData();
}

export default migrateCandidateData; 