// import Candidate from "../models/candidate.model.js";



// // Offer Stats Controllers
// export const getOfferStats = async (req, res) => {
//     try {
//       const { filterType, date } = req.query;
      
//       if (!filterType || !date) {
//         return res.status(400).json({ success: false, message: "filterType and date are required" });
//       }
  
//       let startDate, endDate;
//       const queryDate = new Date(date);
  
//       // Set up date range based on filter type
//       if (filterType === "daily") {
//         startDate = new Date(queryDate.setHours(0, 0, 0, 0));
//         endDate = new Date(queryDate.setHours(23, 59, 59, 999));
//       } else if (filterType === "monthly") {
//         startDate = new Date(queryDate.getFullYear(), queryDate.getMonth(), 1);
//         endDate = new Date(queryDate.getFullYear(), queryDate.getMonth() + 1, 0, 23, 59, 59, 999);
//       } else if (filterType === "yearly") {
//         startDate = new Date(queryDate.getFullYear(), 0, 1);
//         endDate = new Date(queryDate.getFullYear(), 11, 31, 23, 59, 59, 999);
//       } else {
//         return res.status(400).json({ success: false, message: "Invalid filter type. Use daily, monthly, or yearly" });
//       }
  
//       // Find candidates with offers in the date range
//       const offers = await Candidate.aggregate([
//         {
//           $match: {
//             offerLetterReceived: true,
//             offerLetterReceivedDate: { $gte: startDate, $lte: endDate }
//           }
//         },
//         {
//           $project: {
//             studentID: "$candidateId",
//             fullName: "$fullName",
//             companyName: "$companyName",
//             offerLetterDate: "$offerLetterReceivedDate",
//             offerLetterDoc: "$offerLetterDoc",
//             hrName: "$hrName",
//             hrEmail: "$hrEmail",
//             hrPhone: "$hrPhone"
//           }
//         }
//       ]);
  
//       return res.status(200).json({
//         success: true,
//         count: offers.length,
//         data: offers
//       });
//     } catch (error) {
//       console.error("Error fetching offer stats:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Failed to fetch offer statistics",
//         error: error.message
//       });
//     }
//   };
  
//   // Get Offer Details for a specific date
//   export const getOfferDetails = async (req, res) => {
//     try {
//       const { date } = req.params;
      
//       if (!date) {
//         return res.status(400).json({ success: false, message: "Date parameter is required" });
//       }
  
//       const queryDate = new Date(date);
//       const startDate = new Date(queryDate.setHours(0, 0, 0, 0));
//       const endDate = new Date(queryDate.setHours(23, 59, 59, 999));
  
//       const offers = await Candidate.aggregate([
//         {
//           $match: {
//             offerLetterReceived: true,
//             offerLetterReceivedDate: { $gte: startDate, $lte: endDate }
//           }
//         },
//         {
//           $project: {
//             studentID: "$candidateId",
//             fullName: "$fullName",
//             companyName: "$companyName",
//             offerLetterDate: "$offerLetterReceivedDate",
//             offerLetterDoc: "$offerLetterDoc",
//             hrName: "$hrName",
//             hrEmail: "$hrEmail",
//             hrPhone: "$hrPhone"
//           }
//         },
//         {
//           $sort: { offerLetterDate: 1 }
//         }
//       ]);
  
//       return res.status(200).json({
//         success: true,
//         count: offers.length,
//         data: offers
//       });
//     } catch (error) {
//       console.error("Error fetching offer details:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Failed to fetch offer details",
//         error: error.message
//       });
//     }
//   };

import Candidate from "../models/candidate.model.js";

// Offer Stats Controllers
export const getOfferStats = async (req, res) => {
    try {
      const { filterType, date } = req.query;
      
      if (!filterType || !date) {
        return res.status(400).json({ success: false, message: "filterType and date are required" });
      }
  
      let startDate, endDate;
      const queryDate = new Date(date);
  
      // Set up date range based on filter type
      if (filterType === "daily") {
        startDate = new Date(queryDate.setHours(0, 0, 0, 0));
        endDate = new Date(queryDate.setHours(23, 59, 59, 999));
      } else if (filterType === "monthly") {
        startDate = new Date(queryDate.getFullYear(), queryDate.getMonth(), 1);
        endDate = new Date(queryDate.getFullYear(), queryDate.getMonth() + 1, 0, 23, 59, 59, 999);
      } else if (filterType === "yearly") {
        startDate = new Date(queryDate.getFullYear(), 0, 1);
        endDate = new Date(queryDate.getFullYear(), 11, 31, 23, 59, 59, 999);
      } else {
        return res.status(400).json({ success: false, message: "Invalid filter type. Use daily, monthly, or yearly" });
      }
  
      // Find candidates with offers in the date range using the offers array
      const offers = await Candidate.aggregate([
        {
          $match: {
            "offers": { $exists: true, $ne: [] }
          }
        },
        {
          $unwind: "$offers"
        },
        {
          $match: {
            "offers.offerLetterReceived": true,
            "offers.offerLetterReceivedDate": { $gte: startDate, $lte: endDate }
          }
        },
        {
          $project: {
            studentID: "$candidateId",
            fullName: "$fullName",
            companyName: "$offers.companyName",
            offerLetterDate: "$offers.offerLetterReceivedDate",
            offerLetterDoc: "$offers.offerLetterDoc",
            hrName: "$offers.hrName",
            hrEmail: "$offers.hrEmail",
            hrPhone: "$offers.hrPhone",
            onboarded: "$offers.onboarded",
            onboardedDate: "$offers.onboardedDate",
            offerStatus: "$offers.status",
            salary: "$offers.salary",
            position: "$offers.position"
          }
        },
        {
          $sort: { offerLetterDate: -1 }
        }
      ]);
  
      return res.status(200).json({
        success: true,
        count: offers.length,
        data: offers
      });
    } catch (error) {
      console.error("Error fetching offer stats:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch offer statistics",
        error: error.message
      });
    }
  };
  
  // Get Offer Details for a specific date
  export const getOfferDetails = async (req, res) => {
    try {
      const { date } = req.params;
      
      if (!date) {
        return res.status(400).json({ success: false, message: "Date parameter is required" });
      }
  
      const queryDate = new Date(date);
      const startDate = new Date(queryDate.setHours(0, 0, 0, 0));
      const endDate = new Date(queryDate.setHours(23, 59, 59, 999));
  
      const offers = await Candidate.aggregate([
        {
          $match: {
            "offers": { $exists: true, $ne: [] }
          }
        },
        {
          $unwind: "$offers"
        },
        {
          $match: {
            "offers.offerLetterReceived": true,
            "offers.offerLetterReceivedDate": { $gte: startDate, $lte: endDate }
          }
        },
        {
          $project: {
            studentID: "$candidateId",
            fullName: "$fullName",
            companyName: "$offers.companyName",
            offerLetterDate: "$offers.offerLetterReceivedDate",
            offerLetterDoc: "$offers.offerLetterDoc",
            hrName: "$offers.hrName",
            hrEmail: "$offers.hrEmail",
            hrPhone: "$offers.hrPhone",
            onboarded: "$offers.onboarded",
            onboardedDate: "$offers.onboardedDate",
            offerStatus: "$offers.status",
            salary: "$offers.salary",
            position: "$offers.position"
          }
        },
        {
          $sort: { offerLetterDate: 1 }
        }
      ]);
  
      return res.status(200).json({
        success: true,
        count: offers.length,
        data: offers
      });
    } catch (error) {
      console.error("Error fetching offer details:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch offer details",
        error: error.message
      });
    }
  };

  // Get All Offers for a specific candidate
  export const getCandidateOffers = async (req, res) => {
    try {
      const { candidateId } = req.params;
      
      if (!candidateId) {
        return res.status(400).json({ success: false, message: "Candidate ID is required" });
      }
  
      const candidate = await Candidate.findOne({ candidateId }, {
        candidateId: 1,
        fullName: 1,
        offers: 1
      });
  
      if (!candidate) {
        return res.status(404).json({ success: false, message: "Candidate not found" });
      }
  
      return res.status(200).json({
        success: true,
        data: {
          studentID: candidate.candidateId,
          fullName: candidate.fullName,
          offers: candidate.offers || []
        }
      });
    } catch (error) {
      console.error("Error fetching candidate offers:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch candidate offers",
        error: error.message
      });
    }
  };

  // Get Onboarded Candidates Stats
  export const getOnboardedStats = async (req, res) => {
    try {
      const { filterType, date } = req.query;
      
      if (!filterType || !date) {
        return res.status(400).json({ success: false, message: "filterType and date are required" });
      }
  
      let startDate, endDate;
      const queryDate = new Date(date);
  
      // Set up date range based on filter type
      if (filterType === "daily") {
        startDate = new Date(queryDate.setHours(0, 0, 0, 0));
        endDate = new Date(queryDate.setHours(23, 59, 59, 999));
      } else if (filterType === "monthly") {
        startDate = new Date(queryDate.getFullYear(), queryDate.getMonth(), 1);
        endDate = new Date(queryDate.getFullYear(), queryDate.getMonth() + 1, 0, 23, 59, 59, 999);
      } else if (filterType === "yearly") {
        startDate = new Date(queryDate.getFullYear(), 0, 1);
        endDate = new Date(queryDate.getFullYear(), 11, 31, 23, 59, 59, 999);
      } else {
        return res.status(400).json({ success: false, message: "Invalid filter type. Use daily, monthly, or yearly" });
      }
  
      // Find candidates with onboarded offers in the date range
      const onboardedCandidates = await Candidate.aggregate([
        {
          $match: {
            "offers": { $exists: true, $ne: [] }
          }
        },
        {
          $unwind: "$offers"
        },
        {
          $match: {
            "offers.onboarded": true,
            "offers.onboardedDate": { $gte: startDate, $lte: endDate }
          }
        },
        {
          $project: {
            studentID: "$candidateId",
            fullName: "$fullName",
            companyName: "$offers.companyName",
            onboardedDate: "$offers.onboardedDate",
            hrName: "$offers.hrName",
            hrEmail: "$offers.hrEmail",
            hrPhone: "$offers.hrPhone",
            salary: "$offers.salary",
            position: "$offers.position"
          }
        },
        {
          $sort: { onboardedDate: -1 }
        }
      ]);
  
      return res.status(200).json({
        success: true,
        count: onboardedCandidates.length,
        data: onboardedCandidates
      });
    } catch (error) {
      console.error("Error fetching onboarded stats:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch onboarded statistics",
        error: error.message
      });
    }
  };