// import fs from 'fs';
// import csv from 'csv-parser';
// import Candidate from '../models/candidate.model.js';

// export const uploadCandidateCSV = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ success: false, message: 'No file uploaded' });
//   }

//   const filePath = req.file.path;
//   const results = [];

//   try {
//     // Read CSV file
//     await new Promise((resolve, reject) => {
//       fs.createReadStream(filePath)
//         .pipe(csv())
//         .on('data', (data) => results.push(data))
//         .on('end', resolve)
//         .on('error', reject);
//     });

//     const userId = req.user ? req.user._id : null;

//     // Utility functions
//     const parseDate = (dateString) => {
//       if (!dateString) return undefined;
//       dateString = dateString.trim();

//       const formats = [
//         (str) => {
//           const parts = str.split('/');
//           if (parts.length === 3) {
//             return new Date(parts[2], parts[0] - 1, parts[1]);
//           }
//           return null;
//         },
//         (str) => {
//           const parts = str.split('-');
//           if (parts.length === 3) {
//             return new Date(parts[2], parts[1] - 1, parts[0]);
//           }
//           return null;
//         },
//         (str) => new Date(str)
//       ];

//       for (const format of formats) {
//         const date = format(dateString);
//         if (date && !isNaN(date.getTime())) {
//           return date;
//         }
//       }
//       return undefined;
//     };

//     const isValidEmail = (email) => {
//       const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       return re.test(email);
//     };

//     const isValidPhone = (phone) => {
//       // Basic phone validation: digits, optional +, spaces, dashes
//       const re = /^[+\d]?(?:[\d-\s]{3,})$/;
//       return re.test(phone);
//     };

//     // const dateFields = [
//     //   'joiningDate', 'classStartDate', 'trainingStageDate', 'projectsStageDate',
//     //   'pocStageDate', 'profileCreatedStageDate', 'stageUpdateDate', 'inActiveDate',
//     //   'resumeCreatedDate', 'profileCreatedDate', 'videoShootedDate', 'modelCreatedDate',
//     //   'onboardedDate', 'offerLetterReceivedDate', 'receiptCreatedDate', 'loanDistrubutedDate',
//     //   'paymentForInterviewDate', 'paymentForDocumentsDate', 'paymentForOfferDate',
//     //   'entryAgreementSignedDate', 'entryAcknowledgementSignedDate',
//     //   'jobOfferAgreementSignedDate', 'jobOfferAcknowledgementSignedDate',
//     //   'exitAgreementSignedDate', 'exitAcknowledgementSignedDate',
//     //   'entryReceiptCreatedDate', 'jobOfferReceiptCreatedDate', 'exitReceiptCreatedDate'
//     // ];

//     const dateFields = [
//       'joiningDate', 'classStartDate', 'trainingStageDate', 'projectsStageDate',
//       'pocStageDate', 'profileCreatedStageDate', 'stageUpdateDate', 'inActiveDate',
//       'resumeCreatedDate', 'profileCreatedDate', 'videoShootedDate', 'modelCreatedDate',
//       'onboardedDate', 'offerLetterReceivedDate', 'receiptCreatedDate', 'loanDistrubutedDate',
//       'paymentForInterviewDate', 'paymentForDocumentsDate', 'paymentForOfferDate',
//       'entryAgreementSignedDate', 'entryAcknowledgementSignedDate',
//       'jobOfferAgreementSignedDate', 'jobOfferAcknowledgementSignedDate',
//       'exitAgreementSignedDate', 'exitAcknowledgementSignedDate',
//       'entryReceiptCreatedDate', 'jobOfferReceiptCreatedDate', 'exitReceiptCreatedDate'
//     ];

//     // const booleanFields = [
//     //   'resumeCreated', 'profileCreated', 'videoShooted', 'modelCreated',
//     //   'onboarded', 'offerLetterReceived', 'receiptCreated',
//     //   'initialAmount', 'loan',
//     //   'entryAgreementSigned', 'entryAcknowledgementSigned',
//     //   'jobOfferAgreementSigned', 'jobOfferAcknowledgementSigned',
//     //   'exitAgreementSigned', 'exitAcknowledgementSigned',
//     //   'entryReceiptCreated', 'jobOfferReceiptCreated', 'exitReceiptCreated'
//     // ];

//     const booleanFields = [
//       'resumeCreated', 'profileCreated', 'videoShooted', 'modelCreated',
//       'onboarded', 'offerLetterReceived', 'receiptCreated',
//       'initialAmount', 'loan',
//       'entryAgreementSigned', 'entryAcknowledgementSigned',
//       'jobOfferAgreementSigned', 'jobOfferAcknowledgementSigned',
//       'exitAgreementSigned', 'exitAcknowledgementSigned',
//       'entryReceiptCreated', 'jobOfferReceiptCreated', 'exitReceiptCreated'
//     ];

//     const numericFields = [
//       'totalAmount', 'totalAmountReceived', 'balanceAmount',
//       'loanDistrubutedAmount', 'paymentForInterview',
//       'paymentForDocuments', 'paymentForOffer'
//     ];

//     const bulkOperations = [];
//     const errors = [];
//     const successes = [];

//     for (const [index, rawRow] of results.entries()) {
//       try {
//         // Clone row to avoid mutating original CSV object
//         const row = { ...rawRow };

//         // Add createdBy and updatedBy if userId available
//         if (userId) {
//           row.createdBy = userId;
//           row.updatedBy = userId;
//         }

//         // Parse dates
//         dateFields.forEach(field => {
//           if (row[field]) {
//             const parsedDate = parseDate(row[field]);
//             if (parsedDate && !isNaN(parsedDate.getTime())) {
//               row[field] = parsedDate;
//             } else {
//               delete row[field]; // Remove invalid dates
//             }
//           }
//         });

//         // Parse booleans
//         // booleanFields.forEach(field => {
//         //   if (row[field]) {
//         //     const val = String(row[field]).toLowerCase();
//         //     row[field] = (val === 'true' || val === '1' || val === 'yes');
//         //   }
//         // });

//         // Parse numbers
//         // numericFields.forEach(field => {
//         //   if (row[field]) {
//         //     const num = parseFloat(row[field]);
//         //     row[field] = isNaN(num) ? undefined : num;
//         //   }
//         // });

//         // Parse booleans and numbers
// booleanFields.forEach(field => {
//   if (row[field]) {
//     const val = String(row[field]).toLowerCase();
//     row[field] = (val === 'true' || val === '1' || val === 'yes');
//   }
// });

// numericFields.forEach(field => {
//   if (row[field]) {
//     const num = parseFloat(row[field]);
//     row[field] = isNaN(num) ? undefined : num;
//   }
// });

// // Handle new loan format
// const hasLoanData = row.loan || row.loanDistrubutedAmount || row.loanDistrubutedDate;
// if (hasLoanData) {
//   row.loan = [
//     {
//       loan: row.loan ?? false,
//       loanDistrubutedAmount: row.loanDistrubutedAmount ?? undefined,
//       loanDistrubutedDate: row.loanDistrubutedDate ?? undefined,
//     }
//   ];
// }

// // Clean old flat loan fields to avoid conflict
// delete row.loanDistrubutedAmount;
// delete row.loanDistrubutedDate;


//         // Fix swapped course and category
//         if (['software_development', 'software_testing', 'othersCourse'].includes(row.category)) {
//           const temp = row.category;
//           row.category = row.course;
//           row.course = temp;
//         }

//         // Validate required fields
//         if (!row.fullName || !row.email || !row.phone || !row.category) {
//           throw new Error('Missing required fields: fullName, email, phone, or category');
//         }

//         if (!isValidEmail(row.email)) {
//           throw new Error('Invalid email format');
//         }

//         if (!isValidPhone(row.phone)) {
//           throw new Error('Invalid phone format');
//         }

//         // Prepare bulk upsert operation based on email or candidateId
//         const filter = {
//           $or: [
//             { email: row.email },
//             { candidateId: row.candidateId }
//           ]
//         };

//         // Remove undefined fields to avoid Mongo errors
//         Object.keys(row).forEach(key => row[key] === undefined && delete row[key]);

//         bulkOperations.push({
//           updateOne: {
//             filter,
//             update: { $set: row },
//             upsert: true
//           }
//         });

//         successes.push({ row: index + 1, email: row.email, action: 'upserted' });

//       } catch (error) {
//         errors.push({ row: index + 1, error: error.message, rowData: rawRow });
//       }
//     }

//     if (bulkOperations.length > 0) {
//       await Candidate.bulkWrite(bulkOperations);
//     }

//     return res.status(200).json({
//       success: true,
//       message: 'CSV processed successfully',
//       totalRows: results.length,
//       successCount: successes.length,
//       errorCount: errors.length,
//       successes,
//       errors
//     });

//   } catch (error) {
//     console.error('CSV upload error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error processing CSV file',
//       error: error.message
//     });
//   } finally {
//     // Always delete file after processing or error
//     try {
//       if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//       }
//     } catch (unlinkErr) {
//       console.error('Error deleting uploaded CSV file:', unlinkErr);
//     }
//   }
// };


import fs from 'fs';
import csv from 'csv-parser';
import Candidate from '../models/candidate.model.js';

export const uploadCandidateCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const results = [];

  try {
    // Read CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    const userId = req.user ? req.user._id : null;

    const parseDate = (dateString) => {
      if (!dateString) return undefined;
      dateString = dateString.trim();

      const formats = [
        (str) => {
          const parts = str.split('/');
          if (parts.length === 3) {
            return new Date(parts[2], parts[0] - 1, parts[1]);
          }
          return null;
        },
        (str) => {
          const parts = str.split('-');
          if (parts.length === 3) {
            return new Date(parts[2], parts[1] - 1, parts[0]);
          }
          return null;
        },
        (str) => new Date(str)
      ];

      for (const format of formats) {
        const date = format(dateString);
        if (date && !isNaN(date.getTime())) {
          return date;
        }
      }
      return undefined;
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPhone = (phone) => /^[+\d]?(?:[\d-\s]{3,})$/.test(phone);

    const dateFields = [
      'joiningDate', 'classStartDate', 'trainingStageDate', 'projectsStageDate',
      'pocStageDate', 'profileCreatedStageDate', 'stageUpdateDate', 'inActiveDate',
      'resumeCreatedDate', 'profileCreatedDate', 'videoShootedDate', 'modelCreatedDate',
      'onboardedDate', 'offerLetterReceivedDate', 'receiptCreatedDate', 'loanDistrubutedDate',
      'paymentForInterviewDate', 'paymentForDocumentsDate', 'paymentForOfferDate',
      'entryAgreementSignedDate', 'entryAcknowledgementSignedDate',
      'jobOfferAgreementSignedDate', 'jobOfferAcknowledgementSignedDate',
      'exitAgreementSignedDate', 'exitAcknowledgementSignedDate',
      'entryReceiptCreatedDate', 'jobOfferReceiptCreatedDate', 'exitReceiptCreatedDate'
    ];

    const booleanFields = [
      'resumeCreated', 'profileCreated', 'videoShooted', 'modelCreated',
      'onboarded', 'offerLetterReceived', 'receiptCreated',
      'initialAmount', 'loan',
      'entryAgreementSigned', 'entryAcknowledgementSigned',
      'jobOfferAgreementSigned', 'jobOfferAcknowledgementSigned',
      'exitAgreementSigned', 'exitAcknowledgementSigned',
      'entryReceiptCreated', 'jobOfferReceiptCreated', 'exitReceiptCreated'
    ];

    const numericFields = [
      'totalAmount', 'totalAmountReceived', 'balanceAmount',
      'loanDistrubutedAmount', 'paymentForInterview',
      'paymentForDocuments', 'paymentForOffer'
    ];

    const offerFields = [
      'offerLetterReceived', 'offerLetterReceivedDate', 'offerLetterDoc',
      'companyName', 'companyAddress', 'hrName', 'hrPhone', 'hrEmail',
      'onboarded', 'onboardedDate'
    ];

    const bulkOperations = [];
    const errors = [];
    const successes = [];

    for (const [index, rawRow] of results.entries()) {
      try {
        const row = { ...rawRow };

        if (userId) {
          row.createdBy = userId;
          row.updatedBy = userId;
        }

        // Parse dates
        dateFields.forEach(field => {
          if (row[field]) {
            const parsedDate = parseDate(row[field]);
            if (parsedDate && !isNaN(parsedDate.getTime())) {
              row[field] = parsedDate;
            } else {
              delete row[field];
            }
          }
        });

        // Parse booleans and numbers
        booleanFields.forEach(field => {
          if (row[field]) {
            const val = String(row[field]).toLowerCase();
            row[field] = (val === 'true' || val === '1' || val === 'yes');
          }
        });

        numericFields.forEach(field => {
          if (row[field]) {
            const num = parseFloat(row[field]);
            row[field] = isNaN(num) ? undefined : num;
          }
        });

        // Handle new loan format
        const hasLoanData = row.loan || row.loanDistrubutedAmount || row.loanDistrubutedDate;
        if (hasLoanData) {
          row.loan = [{
            loan: row.loan ?? false,
            loanDistrubutedAmount: row.loanDistrubutedAmount ?? undefined,
            loanDistrubutedDate: row.loanDistrubutedDate ?? undefined,
          }];
        }
        delete row.loanDistrubutedAmount;
        delete row.loanDistrubutedDate;

        // Fix swapped course/category
        if (['software_development', 'software_testing', 'othersCourse'].includes(row.category)) {
          const temp = row.category;
          row.category = row.course;
          row.course = temp;
        }

        // Extract offer fields into nested array
        const offerObj = {};
        let hasOfferData = false;

        offerFields.forEach(field => {
          if (rawRow[field]) {
            hasOfferData = true;

            if (dateFields.includes(field)) {
              const parsedDate = parseDate(rawRow[field]);
              if (parsedDate && !isNaN(parsedDate.getTime())) {
                offerObj[field] = parsedDate;
              }
            } else if (booleanFields.includes(field)) {
              const val = String(rawRow[field]).toLowerCase();
              offerObj[field] = (val === 'true' || val === '1' || val === 'yes');
            } else {
              offerObj[field] = rawRow[field];
            }

            delete row[field];
          }
        });

        if (hasOfferData) {
          row.offers = [offerObj];
        }

        // Validate required fields
        if (!row.fullName || !row.email || !row.phone || !row.category) {
          throw new Error('Missing required fields: fullName, email, phone, or category');
        }

        if (!isValidEmail(row.email)) {
          throw new Error('Invalid email format');
        }

        if (!isValidPhone(row.phone)) {
          throw new Error('Invalid phone format');
        }

        // Clean undefined fields
        Object.keys(row).forEach(key => row[key] === undefined && delete row[key]);

        const filter = {
          $or: [
            { email: row.email },
            { candidateId: row.candidateId }
          ]
        };

        bulkOperations.push({
          updateOne: {
            filter,
            update: { $set: row },
            upsert: true
          }
        });

        successes.push({ row: index + 1, email: row.email, action: 'upserted' });

      } catch (error) {
        errors.push({ row: index + 1, error: error.message, rowData: rawRow });
      }
    }

    if (bulkOperations.length > 0) {
      await Candidate.bulkWrite(bulkOperations);
    }

    return res.status(200).json({
      success: true,
      message: 'CSV processed successfully',
      totalRows: results.length,
      successCount: successes.length,
      errorCount: errors.length,
      successes,
      errors
    });

  } catch (error) {
    console.error('CSV upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing CSV file',
      error: error.message
    });
  } finally {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (unlinkErr) {
      console.error('Error deleting uploaded CSV file:', unlinkErr);
    }
  }
};
