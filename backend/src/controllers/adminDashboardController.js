import Candidate from "../models/candidate.model.js";
import { calculateGrowthPercentage, getStatsSummary } from "../services/getStatusSummary.js";




/**
 * Get daily analytics data
 * @route GET /api/analytics/daily
 * @query {String} startDate - Start date in ISO format (optional)
 * @query {String} endDate - End date in ISO format (optional)
 * @query {Number} days - Number of past days to include (default: 7)
 * @access Private
 */
// export const getDailyAnalyticsData = async (req, res) => {
//   try {
//     let { startDate, endDate, days } = req.query;
    
//     // Default to last 7 days if not specified
//     const endDateTime = endDate ? new Date(endDate) : new Date();
//     endDateTime.setHours(23, 59, 59, 999);
    
//     days = days ? parseInt(days) : 7;
    
//     const startDateTime = startDate 
//       ? new Date(startDate) 
//       : new Date(endDateTime);
//     startDateTime.setDate(startDateTime.getDate() - (days - 1));
//     startDateTime.setHours(0, 0, 0, 0);
    
//     // Generate array of days in the range
//     const dailyData = [];
//     const currentDate = new Date(startDateTime);
    
//     while (currentDate <= endDateTime) {
//       const dayStart = new Date(currentDate);
//       dayStart.setHours(0, 0, 0, 0);
      
//       const dayEnd = new Date(currentDate);
//       dayEnd.setHours(23, 59, 59, 999);
      
//       // Get data for the day
//       const dayCounts = await Candidate.aggregate([
//         {
//           $match: {
//             createdAt: { $gte: dayStart, $lte: dayEnd }
//           }
//         },
//         {
//           $group: {
//             _id: null,
//             totalCount: { $sum: 1 },
//             activeCount: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
//             inactiveCount: { $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] } },
//             closedCount: { $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] } },
//             completedCount: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
//             placementCount: { $sum: { $cond: [{ $eq: ["$category", "placement"] }, 1, 0] } },
//             interviewSupportCount: { $sum: { $cond: [{ $eq: ["$category", "interview_support"] }, 1, 0] } },
//             documentServicesCount: { $sum: { $cond: [{ $eq: ["$category", "document_services"] }, 1, 0] } },
//             courseOnlyCount: { $sum: { $cond: [{ $eq: ["$category", "course_only"] }, 1, 0] } },
//             totalAmount: { $sum: { $ifNull: ["$totalAmount", 0] } },
//             totalReceived: { $sum: { $ifNull: ["$totalAmountReceived", 0] } },
//             totalBalance: { $sum: { $ifNull: ["$balanceAmount", 0] } },
//             interviewsCount: { $sum: { $size: { $ifNull: ["$interviews", []] } } },
//             offerLetterCount: { $sum: { $cond: [{ $eq: ["$offerLetterReceived", true] }, 1, 0] } }
//           }
//         }
//       ]);
      
//       const dayData = dayCounts[0] || {
//         totalCount: 0, activeCount: 0, inactiveCount: 0, closedCount: 0, completedCount: 0,
//         placementCount: 0, interviewSupportCount: 0, documentServicesCount: 0, courseOnlyCount: 0,
//         totalAmount: 0, totalReceived: 0, totalBalance: 0, interviewsCount: 0, offerLetterCount: 0
//       };
      
//       dailyData.push({
//         date: dayStart.toISOString().split('T')[0],
//         counts: {
//           totalStudents: dayData.totalCount,
//           status: {
//             active: dayData.activeCount,
//             inactive: dayData.inactiveCount,
//             closed: dayData.closedCount,
//             completed: dayData.completedCount
//           },
//           category: {
//             placement: dayData.placementCount,
//             interview_support: dayData.interviewSupportCount,
//             document_services: dayData.documentServicesCount,
//             course_only: dayData.courseOnlyCount
//           }
//         },
//         financial: {
//           totalAmount: dayData.totalAmount,
//           totalAmountReceived: dayData.totalReceived,
//           totalBalanceAmount: dayData.totalBalance
//         },
//         interviews: {
//           total: dayData.interviewsCount
//         },
//         offers: {
//           total: dayData.offerLetterCount
//         }
//       });
      
//       // Move to next day
//       currentDate.setDate(currentDate.getDate() + 1);
//     }
    
//     res.status(200).json({
//       dateRange: `${startDateTime.toISOString().split('T')[0]} to ${endDateTime.toISOString().split('T')[0]}`,
//       dailyData
//     });
//   } catch (error) {
//     console.error('Daily analytics error:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// export const getDailyAnalyticsData = async (req, res) => {
//   try {
//     let { startDate, endDate, days } = req.query;
    
//     // Default to last 7 days if not specified
//     const endDateTime = endDate ? new Date(endDate) : new Date();
//     endDateTime.setHours(23, 59, 59, 999);
    
//     days = days ? parseInt(days) : 7;
    
//     const startDateTime = startDate 
//       ? new Date(startDate) 
//       : new Date(endDateTime);
//     startDateTime.setDate(startDateTime.getDate() - (days - 1));
//     startDateTime.setHours(0, 0, 0, 0);
    
//     // Generate array of days in the range
//     const dailyData = [];
//     const currentDate = new Date(startDateTime);
    
//     while (currentDate <= endDateTime) {
//       const dayStart = new Date(currentDate);
//       dayStart.setHours(0, 0, 0, 0);
      
//       const dayEnd = new Date(currentDate);
//       dayEnd.setHours(23, 59, 59, 999);
      
//       // Get data for the day - using joiningDate instead of createdAt to match other functions
//       const dayCounts = await Candidate.aggregate([
//         {
//           $match: {
//             joiningDate: { $gte: dayStart, $lte: dayEnd }
//           }
//         },
//         {
//           $group: {
//             _id: null,
//             totalCount: { $sum: 1 },
//             activeCount: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
//             inactiveCount: { $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] } },
//             closedCount: { $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] } },
//             completedCount: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
//             placementCount: { $sum: { $cond: [{ $eq: ["$category", "placement"] }, 1, 0] } },
//             interviewSupportCount: { $sum: { $cond: [{ $eq: ["$category", "interview_support"] }, 1, 0] } },
//             documentServicesCount: { $sum: { $cond: [{ $eq: ["$category", "document_services"] }, 1, 0] } },
//             courseOnlyCount: { $sum: { $cond: [{ $eq: ["$category", "course_only"] }, 1, 0] } },
//             devCount: { $sum: { $cond: [{ $eq: ["$course", "software_development"] }, 1, 0] } },
//             testingCount: { $sum: { $cond: [{ $eq: ["$course", "software_testing"] }, 1, 0] } },
//             otherCoursesCount: { $sum: { $cond: [{ $eq: ["$course", "othersCourse"] }, 1, 0] } },
//             totalAmount: { $sum: { $ifNull: ["$totalAmount", 0] } },
//             totalReceived: { $sum: { $ifNull: ["$totalAmountReceived", 0] } },
//             totalBalance: { $sum: { $ifNull: ["$balanceAmount", 0] } },
//             totalLoan: {
//               $sum: {
//                 $cond: [
//                   { $eq: ["$loan", true] },
//                   { $ifNull: ["$loanDistrubutedAmount", 0] },
//                   0
//                 ]
//               }
//             },
//             initialAmountCount: { $sum: { $cond: [{ $eq: ["$initialAmount", true] }, 1, 0] } },
//             profileCreatedCount: { $sum: { $cond: [{ $eq: ["$profileCreated", true] }, 1, 0] } },
//             videoShootedCount: { $sum: { $cond: [{ $eq: ["$videoShooted", true] }, 1, 0] } },
//             modelCreatedCount: { $sum: { $cond: [{ $eq: ["$modelCreated", true] }, 1, 0] } },
//             totalInterviews: { $sum: { $size: { $ifNull: ["$interviews", []] } } },
//             candidatesWithInterviews: {
//               $sum: { $cond: [{ $gt: [{ $size: { $ifNull: ["$interviews", []] } }, 0] }, 1, 0] }
//             },
//             offerLetterCount: { $sum: { $cond: [{ $eq: ["$offerLetterReceived", true] }, 1, 0] } }
//           }
//         }
//       ]);
      
//       const dayData = dayCounts[0] || {
//         totalCount: 0, activeCount: 0, inactiveCount: 0, closedCount: 0, completedCount: 0,
//         placementCount: 0, interviewSupportCount: 0, documentServicesCount: 0, courseOnlyCount: 0,
//         devCount: 0, testingCount: 0, otherCoursesCount: 0,
//         totalAmount: 0, totalReceived: 0, totalBalance: 0, totalLoan: 0, initialAmountCount: 0,
//         profileCreatedCount: 0, videoShootedCount: 0, modelCreatedCount: 0,
//         totalInterviews: 0, candidatesWithInterviews: 0, offerLetterCount: 0
//       };
      
//       dailyData.push({
//         date: dayStart.toISOString().split('T')[0],
//         counts: {
//           totalStudents: dayData.totalCount,
//           status: {
//             active: dayData.activeCount,
//             inactive: dayData.inactiveCount,
//             closed: dayData.closedCount,
//             completed: dayData.completedCount
//           },
//           category: {
//             placement: dayData.placementCount,
//             interview_support: dayData.interviewSupportCount,
//             document_services: dayData.documentServicesCount,
//             course_only: dayData.courseOnlyCount
//           },
//           course: {
//             software_development: dayData.devCount,
//             software_testing: dayData.testingCount,
//             othersCourse: dayData.otherCoursesCount
//           }
//         },
//         financial: {
//           totalAmount: dayData.totalAmount,
//           totalAmountReceived: dayData.totalReceived,
//           totalBalanceAmount: dayData.totalBalance,
//           totalLoanAmount: dayData.totalLoan,
//           initialAmountCount: dayData.initialAmountCount
//         },
//         lifecycle: {
//           profileCreated: dayData.profileCreatedCount,
//           videoShooted: dayData.videoShootedCount,
//           modelCreated: dayData.modelCreatedCount
//         },
//         interviews: {
//           total: dayData.totalInterviews,
//           candidatesWithInterviews: dayData.candidatesWithInterviews
//         },
//         offers: {
//           total: dayData.offerLetterCount
//         }
//       });
      
//       // Move to next day
//       currentDate.setDate(currentDate.getDate() + 1);
//     }
    
//     res.status(200).json({
//       dateRange: `${startDateTime.toISOString().split('T')[0]} to ${endDateTime.toISOString().split('T')[0]}`,
//       dailyData
//     });
//   } catch (error) {
//     console.error('Daily analytics error:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

export const getDailyAnalyticsData = async (req, res) => {
  try {
    let { startDate, endDate, days } = req.query;
    
    // Default to last 7 days if not specified
    const endDateTime = endDate ? new Date(endDate) : new Date();
    endDateTime.setHours(23, 59, 59, 999);
    
    days = days ? parseInt(days) : 7;
    
    const startDateTime = startDate 
      ? new Date(startDate) 
      : new Date(endDateTime);
    startDateTime.setDate(startDateTime.getDate() - (days - 1));
    startDateTime.setHours(0, 0, 0, 0);
    
    // Generate array of days in the range
    const dailyData = [];
    const currentDate = new Date(startDateTime);
    
    while (currentDate <= endDateTime) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      // Get data for the day - using joiningDate with date-only comparison to avoid timezone issues
      const dayCounts = await Candidate.aggregate([
        {
          $addFields: {
            // Convert joiningDate to local date string in format YYYY-MM-DD
            joiningDateString: {
              $dateToString: { format: "%Y-%m-%d", date: "$joiningDate" }
            },
            // Current day in format YYYY-MM-DD 
            currentDayString: {
              $dateToString: { format: "%Y-%m-%d", date: dayStart }
            }
          }
        },
        {
          $match: {
            // Match based on date string equality instead of datetime range
            $expr: { $eq: ["$joiningDateString", "$currentDayString"] }
          }
        },
        {
          $group: {
            _id: null,
            totalCount: { $sum: 1 },
            activeCount: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
            inactiveCount: { $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] } },
            closedCount: { $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] } },
            completedCount: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
            placementCount: { $sum: { $cond: [{ $eq: ["$category", "placement"] }, 1, 0] } },
            interviewSupportCount: { $sum: { $cond: [{ $eq: ["$category", "interview_support"] }, 1, 0] } },
            documentServicesCount: { $sum: { $cond: [{ $eq: ["$category", "document_services"] }, 1, 0] } },
            courseOnlyCount: { $sum: { $cond: [{ $eq: ["$category", "course_only"] }, 1, 0] } },
            devCount: { $sum: { $cond: [{ $eq: ["$course", "software_development"] }, 1, 0] } },
            testingCount: { $sum: { $cond: [{ $eq: ["$course", "software_testing"] }, 1, 0] } },
            otherCoursesCount: { $sum: { $cond: [{ $eq: ["$course", "othersCourse"] }, 1, 0] } },
            totalAmount: { $sum: { $ifNull: ["$totalAmount", 0] } },
            totalReceived: { $sum: { $ifNull: ["$totalAmountReceived", 0] } },
            totalBalance: { $sum: { $ifNull: ["$balanceAmount", 0] } },
            totalLoan: {
              $sum: {
                $cond: [
                  { $eq: ["$loan", true] },
                  { $ifNull: ["$loanDistrubutedAmount", 0] },
                  0
                ]
              }
            },
            initialAmountCount: { $sum: { $cond: [{ $eq: ["$initialAmount", true] }, 1, 0] } },
            profileCreatedCount: { $sum: { $cond: [{ $eq: ["$profileCreated", true] }, 1, 0] } },
            videoShootedCount: { $sum: { $cond: [{ $eq: ["$videoShooted", true] }, 1, 0] } },
            modelCreatedCount: { $sum: { $cond: [{ $eq: ["$modelCreated", true] }, 1, 0] } },
            totalInterviews: { $sum: { $size: { $ifNull: ["$interviews", []] } } },
            candidatesWithInterviews: {
              $sum: { $cond: [{ $gt: [{ $size: { $ifNull: ["$interviews", []] } }, 0] }, 1, 0] }
            },
            offerLetterCount: { $sum: { $cond: [{ $eq: ["$offerLetterReceived", true] }, 1, 0] } }
          }
        }
      ]);
      
      const dayData = dayCounts[0] || {
        totalCount: 0, activeCount: 0, inactiveCount: 0, closedCount: 0, completedCount: 0,
        placementCount: 0, interviewSupportCount: 0, documentServicesCount: 0, courseOnlyCount: 0,
        devCount: 0, testingCount: 0, otherCoursesCount: 0,
        totalAmount: 0, totalReceived: 0, totalBalance: 0, totalLoan: 0, initialAmountCount: 0,
        profileCreatedCount: 0, videoShootedCount: 0, modelCreatedCount: 0,
        totalInterviews: 0, candidatesWithInterviews: 0, offerLetterCount: 0
      };
      
      dailyData.push({
        date: dayStart.toISOString().split('T')[0],
        counts: {
          totalStudents: dayData.totalCount,
          status: {
            active: dayData.activeCount,
            inactive: dayData.inactiveCount,
            closed: dayData.closedCount,
            completed: dayData.completedCount
          },
          category: {
            placement: dayData.placementCount,
            interview_support: dayData.interviewSupportCount,
            document_services: dayData.documentServicesCount,
            course_only: dayData.courseOnlyCount
          },
          course: {
            software_development: dayData.devCount,
            software_testing: dayData.testingCount,
            othersCourse: dayData.otherCoursesCount
          }
        },
        financial: {
          totalAmount: dayData.totalAmount,
          totalAmountReceived: dayData.totalReceived,
          totalBalanceAmount: dayData.totalBalance,
          totalLoanAmount: dayData.totalLoan,
          initialAmountCount: dayData.initialAmountCount
        },
        lifecycle: {
          profileCreated: dayData.profileCreatedCount,
          videoShooted: dayData.videoShootedCount,
          modelCreated: dayData.modelCreatedCount
        },
        interviews: {
          total: dayData.totalInterviews,
          candidatesWithInterviews: dayData.candidatesWithInterviews
        },
        offers: {
          total: dayData.offerLetterCount
        }
      });
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    res.status(200).json({
      dateRange: `${startDateTime.toISOString().split('T')[0]} to ${endDateTime.toISOString().split('T')[0]}`,
      dailyData
    });
  } catch (error) {
    console.error('Daily analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get weekly analytics data
 * @route GET /api/analytics/weekly
 * @query {String} startDate - Start date in ISO format (optional)
 * @query {String} endDate - End date in ISO format (optional)
 * @query {Number} weeks - Number of past weeks to include (default: 4)
 * @access Private
 */
export const getWeeklyAnalyticsData = async (req, res) => {
  try {
    let { startDate, endDate, weeks } = req.query;
    
    // Default to last 4 weeks if not specified
    const endDateTime = endDate ? new Date(endDate) : new Date();
    // Set to end of week (Sunday)
    const endDayOfWeek = endDateTime.getDay();
    endDateTime.setDate(endDateTime.getDate() + (6 - endDayOfWeek));
    endDateTime.setHours(23, 59, 59, 999);
    
    weeks = weeks ? parseInt(weeks) : 4;
    
    const startDateTime = startDate 
      ? new Date(startDate) 
      : new Date(endDateTime);
    // Move back by specified number of weeks
    startDateTime.setDate(startDateTime.getDate() - (7 * (weeks - 1)));
    // Set to start of week (Monday)
    const startDayOfWeek = startDateTime.getDay();
    const daysToSubtract = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    startDateTime.setDate(startDateTime.getDate() - daysToSubtract);
    startDateTime.setHours(0, 0, 0, 0);
    
    // Generate array of weeks in the range
    const weeklyData = [];
    const currentDate = new Date(startDateTime);
    
    while (currentDate <= endDateTime) {
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      // For incomplete weeks, cap at endDateTime
      const adjustedWeekEnd = weekEnd > endDateTime ? endDateTime : weekEnd;
      
      // Get data for the week
      const weekCounts = await Candidate.aggregate([
        {
          $match: {
            createdAt: { $gte: weekStart, $lte: adjustedWeekEnd }
          }
        },
        {
          $group: {
            _id: null,
            totalCount: { $sum: 1 },
            activeCount: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
            inactiveCount: { $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] } },
            closedCount: { $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] } },
            completedCount: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
            placementCount: { $sum: { $cond: [{ $eq: ["$category", "placement"] }, 1, 0] } },
            interviewSupportCount: { $sum: { $cond: [{ $eq: ["$category", "interview_support"] }, 1, 0] } },
            documentServicesCount: { $sum: { $cond: [{ $eq: ["$category", "document_services"] }, 1, 0] } },
            courseOnlyCount: { $sum: { $cond: [{ $eq: ["$category", "course_only"] }, 1, 0] } },
            devCount: { $sum: { $cond: [{ $eq: ["$course", "software_development"] }, 1, 0] } },
            testingCount: { $sum: { $cond: [{ $eq: ["$course", "software_testing"] }, 1, 0] } },
            otherCoursesCount: { $sum: { $cond: [{ $eq: ["$course", "othersCourse"] }, 1, 0] } },
            totalAmount: { $sum: { $ifNull: ["$totalAmount", 0] } },
            totalReceived: { $sum: { $ifNull: ["$totalAmountReceived", 0] } },
            totalBalance: { $sum: { $ifNull: ["$balanceAmount", 0] } },
            totalLoan: { $sum: { $cond: [{ $eq: ["$loan", true] }, { $ifNull: ["$loanDistrubutedAmount", 0] }, 0] } },
            initialAmountCount: { $sum: { $cond: [{ $eq: ["$initialAmount", true] }, 1, 0] } },
            profileCreatedCount: { $sum: { $cond: [{ $eq: ["$profileCreated", true] }, 1, 0] } },
            videoShootedCount: { $sum: { $cond: [{ $eq: ["$videoShooted", true] }, 1, 0] } },
            modelCreatedCount: { $sum: { $cond: [{ $eq: ["$modelCreated", true] }, 1, 0] } },
            interviewsCount: { $sum: { $size: { $ifNull: ["$interviews", []] } } },
            offerLetterCount: { $sum: { $cond: [{ $eq: ["$offerLetterReceived", true] }, 1, 0] } }
          }
        }
      ]);
      
      const weekData = weekCounts[0] || {
        totalCount: 0, activeCount: 0, inactiveCount: 0, closedCount: 0, completedCount: 0,
        placementCount: 0, interviewSupportCount: 0, documentServicesCount: 0, courseOnlyCount: 0,
        devCount: 0, testingCount: 0, totalAmount: 0, totalReceived: 0, totalBalance: 0,
        totalLoan: 0, initialAmountCount: 0, profileCreatedCount: 0, videoShootedCount: 0,
        modelCreatedCount: 0, interviewsCount: 0, offerLetterCount: 0
      };
      
      weeklyData.push({
        weekStart: weekStart.toISOString().split('T')[0],
        weekEnd: adjustedWeekEnd.toISOString().split('T')[0],
        counts: {
          totalStudents: weekData.totalCount,
          status: {
            active: weekData.activeCount,
            inactive: weekData.inactiveCount,
            closed: weekData.closedCount,
            completed: weekData.completedCount
          },
          category: {
            placement: weekData.placementCount,
            interview_support: weekData.interviewSupportCount,
            document_services: weekData.documentServicesCount,
            course_only: weekData.courseOnlyCount
          },
          course: {
            software_development: weekData.devCount,
            software_testing: weekData.testingCount,
            othersCourse: weekData.otherCoursesCount
          }
        },
        financial: {
          totalAmount: weekData.totalAmount,
          totalAmountReceived: weekData.totalReceived,
          totalBalanceAmount: weekData.totalBalance,
          totalLoanAmount: weekData.totalLoan,
          initialAmountCount: weekData.initialAmountCount
        },
        lifecycle: {
          profileCreated: weekData.profileCreatedCount,
          videoShooted: weekData.videoShootedCount,
          modelCreated: weekData.modelCreatedCount
        },
        interviews: {
          total: weekData.interviewsCount
        },
        offers: {
          total: weekData.offerLetterCount
        }
      });
      
      // Move to next week
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    res.status(200).json({
      dateRange: `${startDateTime.toISOString().split('T')[0]} to ${endDateTime.toISOString().split('T')[0]}`,
      weeklyData
    });
  } catch (error) {
    console.error('Weekly analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


/**
 * Get analytics data by month and year
 * @route GET /api/analytics
 * @query {Number} year - Year to filter by (optional)
 * @query {Number} month - Month to filter by (optional, 1-12)
 * @access Private
 */
export const getAnalyticsData = async (req, res) => {
    try {
      const { year, month } = req.query;
      
      // Build date filters
      let dateFilter = {};
      
      if (year && month) {
        // Filter for specific month and year
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0); // Last day of month
        
        dateFilter = {
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        };
      } else if (year) {
        // Filter for entire year
        const startDate = new Date(parseInt(year), 0, 1);
        const endDate = new Date(parseInt(year), 11, 31, 23, 59, 59, 999);
        
        dateFilter = {
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        };
      }
  
      // Get basic counts
      const totalStudents = await Candidate.countDocuments(dateFilter);
      
      // Status counts
      const statusCounts = await Candidate.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
      
      // Convert to object for easier access
      const statusMap = statusCounts.reduce((acc, status) => {
        acc[status._id] = status.count;
        return acc;
      }, {});
      
      // Category counts
      const categoryCounts = await Candidate.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        }
      ]);
      
      // Convert to object for easier access
      const categoryMap = categoryCounts.reduce((acc, category) => {
        acc[category._id] = category.count;
        return acc;
      }, {});
      
      // Course counts
      const courseCounts = await Candidate.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$course',
            count: { $sum: 1 }
          }
        }
      ]);
      
      // Convert to object for easier access
      const courseMap = courseCounts.reduce((acc, course) => {
        acc[course._id] = course.count;
        return acc;
      }, {});
      
      // Financial aggregates
      const financialData = await Candidate.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: { $ifNull: ['$totalAmount', 0] } },
            totalAmountReceived: { $sum: { $ifNull: ['$totalAmountReceived', 0] } },
            totalBalanceAmount: { $sum: { $ifNull: ['$balanceAmount', 0] } },
            totalLoanAmount: { $sum: { $cond: [{ $eq: ['$loan', true] }, { $ifNull: ['$loanDistrubutedAmount', 0] }, 0] } }
          }
        }
      ]);
      
      // Process stage counts
      const profileCount = await Candidate.countDocuments({ ...dateFilter, profileCreated: true });
      const videoCount = await Candidate.countDocuments({ ...dateFilter, videoShooted: true });
      const modelCount = await Candidate.countDocuments({ ...dateFilter, modelCreated: true });
      
      // Get initial amount count
      const initialAmountCount = await Candidate.countDocuments({ ...dateFilter, initialAmount: true });
      
      // Compile response
      const analytics = {
        period: year && month ? `${year}-${month}` : year ? `${year}` : 'All time',
        counts: {
          totalStudents,
          status: {
            active: statusMap.active || 0,
            inactive: statusMap.inactive || 0,
            closed: statusMap.closed || 0,
            completed: statusMap.completed || 0
          },
          category: {
            placement: categoryMap.placement || 0,
            interview_support: categoryMap.interview_support || 0,
            document_services: categoryMap.document_services || 0,
            course_only: categoryMap.course_only || 0
          },
          course: {
            software_development: courseMap.software_development || 0,
            software_testing: courseMap.software_testing || 0,
            othersCourse: courseMap.othersCourse || 0
            
          }
        },
        financial: {
          totalAmount: financialData[0]?.totalAmount || 0,
          totalAmountReceived: financialData[0]?.totalAmountReceived || 0,
          totalBalanceAmount: financialData[0]?.totalBalanceAmount || 0,
          totalLoanAmount: financialData[0]?.totalLoanAmount || 0,
          initialAmountCount
        },
        lifecycle: {
          profileCreated: profileCount,
          videoShooted: videoCount,
          modelCreated: modelCount
        }
      };
      
      res.status(200).json(analytics);
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  /**
 * Get analytics data by month for a specific year
 * @route GET /api/analytics/monthly
 * @query {Number} year - Year to get monthly breakdown for (required)
 * @access Private
 */
  export const getMonthlyAnalyticsData = async (req, res) => {
    try {
      const { year } = req.query;
      
      if (!year) {
        return res.status(400).json({ message: 'Year parameter is required' });
      }
      
      const startDate = new Date(parseInt(year), 0, 1);
      const endDate = new Date(parseInt(year), 11, 31, 23, 59, 59, 999);
      
      // Monthly breakdown of registrations
      const monthlyRegistrations = await Candidate.aggregate([
        // {
        //   $match: {
        //     createdAt: {
        //       $gte: startDate,
        //       $lte: endDate
        //     }
        //   }
        // },
        {
        $match: {
          joiningDate: {
            $gte: startDate,
            $lte: endDate
          }
        },
      },
        
        {
          $group: {
            _id: { month: { $month: "$joiningDate" } },
            count: { $sum: 1 },
            activeCount: {
              $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
            },
            inactiveCount: {
              $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] }
            },
            closedCount: {
              $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] }
            },
            completedCount: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
            },
            placementCount: {
              $sum: { $cond: [{ $eq: ["$category", "placement"] }, 1, 0] }
            },
            interviewSupportCount: {
              $sum: { $cond: [{ $eq: ["$category", "interview_support"] }, 1, 0] }
            },
            documentServicesCount: {
              $sum: { $cond: [{ $eq: ["$category", "document_services"] }, 1, 0] }
            },
            courseOnlyCount: {
              $sum: { $cond: [{ $eq: ["$category", "course_only"] }, 1, 0] }
            },
            devCount: {
              $sum: { $cond: [{ $eq: ["$course", "software_development"] }, 1, 0] }
            },
            testingCount: {
              $sum: { $cond: [{ $eq: ["$course", "software_testing"] }, 1, 0] }
            },
            otherCoursesCount: {
              $sum: { $cond: [{ $eq: ["$course", "othersCourse"] }, 1, 0] }
            },
            totalAmount: { $sum: { $ifNull: ["$totalAmount", 0] } },
            totalReceived: { $sum: { $ifNull: ["$totalAmountReceived", 0] } },
            totalBalance: { $sum: { $ifNull: ["$balanceAmount", 0] } },
            totalLoan: {
              $sum: {
                $cond: [
                  { $eq: ["$loan", true] },
                  { $ifNull: ["$loanDistrubutedAmount", 0] },
                  0
                ]
              }
            },
            initialAmountCount: {
              $sum: { $cond: [{ $eq: ["$initialAmount", true] }, 1, 0] }
            },
            profileCreatedCount: {
              $sum: { $cond: [{ $eq: ["$profileCreated", true] }, 1, 0] }
            },
            videoShootedCount: {
              $sum: { $cond: [{ $eq: ["$videoShooted", true] }, 1, 0] }
            },
            modelCreatedCount: {
              $sum: { $cond: [{ $eq: ["$modelCreated", true] }, 1, 0] }
            },
            totalInterviews: {
              $sum: { $size: { $ifNull: ["$interviews", []] } }
            },
            candidatesWithInterviews: {
              $sum: { $cond: [{ $gt: [{ $size: { $ifNull: ["$interviews", []] } }, 0] }, 1, 0] }
            },
            offerLetterCount: {
              $sum: { $cond: [{ $eq: ["$offerLetterReceived", true] }, 1, 0] }
            }
          }
        },
        {
          $sort: { "_id.month": 1 }
        }
      ]);
      
      // Convert to more readable format with month names
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      
      const monthlyData = monthlyRegistrations.map(item => ({
        month: monthNames[item._id.month - 1],
        monthNumber: item._id.month,
        counts: {
          totalStudents: item.count,
          status: {
            active: item.activeCount,
            inactive: item.inactiveCount,
            closed: item.closedCount,
            completed: item.completedCount
          },
          category: {
            placement: item.placementCount,
            interview_support: item.interviewSupportCount,
            document_services: item.documentServicesCount,
            course_only: item.courseOnlyCount
          },
          course: {
            software_development: item.devCount,
            software_testing: item.testingCount,
            othersCourse: item.otherCoursesCount
          }
        },
        financial: {
          totalAmount: item.totalAmount,
          totalAmountReceived: item.totalReceived,
          totalBalanceAmount: item.totalBalance,
          totalLoanAmount: item.totalLoan,
          initialAmountCount: item.initialAmountCount
        },
        lifecycle: {
          profileCreated: item.profileCreatedCount,
          videoShooted: item.videoShootedCount,
          modelCreated: item.modelCreatedCount
        },
        interviews: {
          total: item.totalInterviews,
          candidatesWithInterviews: item.candidatesWithInterviews
        },
        offers: {
          total: item.offerLetterCount
        }
      }));
      
      // Fill in missing months with zeros
      const completeMonthlyData = monthNames.map((name, index) => {
        const existingData = monthlyData.find(d => d.monthNumber === index + 1);
        
        if (existingData) {
          return existingData;
        } else {
          return {
            month: name,
            monthNumber: index + 1,
            counts: {
              totalStudents: 0,
              status: { active: 0, inactive: 0, closed: 0, completed: 0 },
              category: { placement: 0, interview_support: 0, document_services: 0, course_only: 0 },
              course: { software_development: 0, software_testing: 0, othersCourse: 0 }
            },
            financial: {
              totalAmount: 0,
              totalAmountReceived: 0,
              totalBalanceAmount: 0,
              totalLoanAmount: 0,
              initialAmountCount: 0
            },
            lifecycle: {
              profileCreated: 0,
              videoShooted: 0,
              modelCreated: 0
            },
            interviews: {
              total: 0,
              candidatesWithInterviews: 0
            },
            offers: {
              total: 0
            }
          };
        }
      });
      
      res.status(200).json({
        year: parseInt(year),
        monthlyData: completeMonthlyData
      });
    } catch (error) {
      console.error('Monthly analytics error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


  /**
 * Get yearly trend analytics
 * @route GET /api/analytics/yearly
 * @query {Number} startYear - Starting year (optional)
 * @query {Number} endYear - Ending year (optional)
 * @access Private
 */
 export const getYearlyAnalyticsData = async (req, res) => {
    try {
      let { startYear, endYear } = req.query;
      
      // Default to last 5 years if not specified
      const currentYear = new Date().getFullYear();
      startYear = startYear ? parseInt(startYear) : currentYear - 4;
      endYear = endYear ? parseInt(endYear) : currentYear;
      
      // Create array of years to analyze
      const years = [];
      for (let year = startYear; year <= endYear; year++) {
        years.push(year);
      }
      
      // Get data for each year
      const yearlyData = await Promise.all(years.map(async (year) => {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
        
        // Get summary data for the year
        const yearData = await Candidate.aggregate([
          // {
          //   $match: {
          //     createdAt: {
          //       $gte: startDate,
          //       $lte: endDate
          //     }
          //   }
          // },
          
          {
            $match: {
              joiningDate: {
                $gte: startDate,
                $lte: endDate
              }
            }
          },
          {
            $group: {
              _id: null,
              totalCount: { $sum: 1 },
              activeCount: {
                $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
              },
              inactiveCount: {
                $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] }
              },
              closedCount: {
                $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] }
              },
              completedCount: {
                $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
              },
              placementCount: {
                $sum: { $cond: [{ $eq: ["$category", "placement"] }, 1, 0] }
              },
              interviewSupportCount: {
                $sum: { $cond: [{ $eq: ["$category", "interview_support"] }, 1, 0] }
              },
              documentServicesCount: {
                $sum: { $cond: [{ $eq: ["$category", "document_services"] }, 1, 0] }
              },
              courseOnlyCount: {
                $sum: { $cond: [{ $eq: ["$category", "course_only"] }, 1, 0] }
              },
              devCount: {
                $sum: { $cond: [{ $eq: ["$course", "software_development"] }, 1, 0] }
              },
              testingCount: {
                $sum: { $cond: [{ $eq: ["$course", "software_testing"] }, 1, 0] }
              },
              otherCoursesCount: {
                $sum: { $cond: [{ $eq: ["$course", "othersCourse"] }, 1, 0] }
              },
              totalAmount: { $sum: { $ifNull: ["$totalAmount", 0] } },
              totalReceived: { $sum: { $ifNull: ["$totalAmountReceived", 0] } },
              totalBalance: { $sum: { $ifNull: ["$balanceAmount", 0] } },
              totalLoan: {
                $sum: {
                  $cond: [
                    { $eq: ["$loan", true] },
                    { $ifNull: ["$loanDistrubutedAmount", 0] },
                    0
                  ]
                }
              },
              initialAmountCount: {
                $sum: { $cond: [{ $eq: ["$initialAmount", true] }, 1, 0] }
              },
              profileCreatedCount: {
                $sum: { $cond: [{ $eq: ["$profileCreated", true] }, 1, 0] }
              },
              videoShootedCount: {
                $sum: { $cond: [{ $eq: ["$videoShooted", true] }, 1, 0] }
              },
              modelCreatedCount: {
                $sum: { $cond: [{ $eq: ["$modelCreated", true] }, 1, 0] }
              },
              totalInterviews: {
                $sum: { $size: { $ifNull: ["$interviews", []] } }
              },
              candidatesWithInterviews: {
                $sum: { $cond: [{ $gt: [{ $size: { $ifNull: ["$interviews", []] } }, 0] }, 1, 0] }
              },
              offerLetterCount: {
                $sum: { $cond: [{ $eq: ["$offerLetterReceived", true] }, 1, 0] }
              }
            }
          }
        ]);
        
        const data = yearData[0] || {
          totalCount: 0,
          activeCount: 0,
          inactiveCount: 0,
          closedCount: 0,
          completedCount: 0,
          placementCount: 0,
          interviewSupportCount: 0,
          documentServicesCount: 0,
          courseOnlyCount: 0,
          devCount: 0,
          testingCount: 0,
          otherCoursesCount: 0,
          totalAmount: 0,
          totalReceived: 0,
          totalBalance: 0,
          totalLoan: 0,
          initialAmountCount: 0,
          profileCreatedCount: 0,
          videoShootedCount: 0,
          modelCreatedCount: 0
        };
        
        return {
          year,
          counts: {
            totalStudents: data.totalCount,
            status: {
              active: data.activeCount,
              inactive: data.inactiveCount,
              closed: data.closedCount,
              completed: data.completedCount
            },
            category: {
              placement: data.placementCount,
              interview_support: data.interviewSupportCount,
              document_services: data.documentServicesCount,
              course_only: data.courseOnlyCount
            },
            course: {
              software_development: data.devCount,
              software_testing: data.testingCount,
              othersCourse: data.otherCoursesCount
            }
          },
          financial: {
            totalAmount: data.totalAmount,
            totalAmountReceived: data.totalReceived,
            totalBalanceAmount: data.totalBalance,
            totalLoanAmount: data.totalLoan,
            initialAmountCount: data.initialAmountCount
          },
          lifecycle: {
            profileCreated: data.profileCreatedCount,
            videoShooted: data.videoShootedCount,
            modelCreated: data.modelCreatedCount
          },
          interviews: {
            total: data.totalInterviews,
            candidatesWithInterviews: data.candidatesWithInterviews
          },
          offers: {
            total: data.offerLetterCount
          }
        };
      }));
      
      res.status(200).json({
        yearRange: `${startYear}-${endYear}`,
        yearlyData
      });
    } catch (error) {
      console.error('Yearly analytics error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }


  /**
 * Get analytics dashboard summary data
 * @route GET /api/analytics/dashboard
 * @access Private
 */
export const getDashboardAnalyticsData = async (req, res) => {
    try {
      // Get current year and month
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      
      // Date ranges
      const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
      const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);
      
      const startOfYear = new Date(currentYear, 0, 1);
      const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);
      
      // Get comprehensive data for dashboard view - ALL DATA FROM DATABASE
      const overallStats = await getStatsSummary({});
      const yearlyStats = await getStatsSummary({ 
        createdAt: { $gte: startOfYear, $lte: endOfYear } 
      });
      const monthlyStats = await getStatsSummary({ 
        createdAt: { $gte: startOfMonth, $lte: endOfMonth } 
      });
      
      // Get additional comprehensive data for dashboard
      const comprehensiveData = await Candidate.aggregate([
        {
          $group: {
            _id: null,
            totalStudents: { $sum: 1 },
            activeCount: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
            inactiveCount: { $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] } },
            closedCount: { $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] } },
            completedCount: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
            placementCount: { $sum: { $cond: [{ $eq: ["$category", "placement"] }, 1, 0] } },
            interviewSupportCount: { $sum: { $cond: [{ $eq: ["$category", "interview_support"] }, 1, 0] } },
            documentServicesCount: { $sum: { $cond: [{ $eq: ["$category", "document_services"] }, 1, 0] } },
            courseOnlyCount: { $sum: { $cond: [{ $eq: ["$category", "course_only"] }, 1, 0] } },
            softwareDevCount: { $sum: { $cond: [{ $eq: ["$course", "software_development"] }, 1, 0] } },
            softwareTestingCount: { $sum: { $cond: [{ $eq: ["$course", "software_testing"] }, 1, 0] } },
            othersCourseCount: { $sum: { $cond: [{ $eq: ["$course", "othersCourse"] }, 1, 0] } },
            totalAmount: { $sum: { $ifNull: ["$totalAmount", 0] } },
            totalAmountReceived: { $sum: { $ifNull: ["$totalAmountReceived", 0] } },
            totalBalanceAmount: { $sum: { $ifNull: ["$balanceAmount", 0] } },
            totalLoanAmount: { $sum: { $cond: [{ $eq: ["$loan", true] }, { $ifNull: ["$loanDistrubutedAmount", 0] }, 0] } },
            profileCreatedCount: { $sum: { $cond: [{ $eq: ["$profileCreated", true] }, 1, 0] } },
            videoShootedCount: { $sum: { $cond: [{ $eq: ["$videoShooted", true] }, 1, 0] } },
            modelCreatedCount: { $sum: { $cond: [{ $eq: ["$modelCreated", true] }, 1, 0] } },
            totalInterviews: { $sum: { $size: { $ifNull: ["$interviews", []] } } },
            candidatesWithInterviews: { $sum: { $cond: [{ $gt: [{ $size: { $ifNull: ["$interviews", []] } }, 0] }, 1, 0] } },
            offerLetterCount: { $sum: { $cond: [{ $eq: ["$offerLetterReceived", true] }, 1, 0] } }
          }
        }
      ]);
      
      const allData = comprehensiveData[0] || {
        totalStudents: 0,
        activeCount: 0,
        inactiveCount: 0,
        closedCount: 0,
        completedCount: 0,
        placementCount: 0,
        interviewSupportCount: 0,
        documentServicesCount: 0,
        courseOnlyCount: 0,
        softwareDevCount: 0,
        softwareTestingCount: 0,
        othersCourseCount: 0,
        totalAmount: 0,
        totalAmountReceived: 0,
        totalBalanceAmount: 0,
        totalLoanAmount: 0,
        profileCreatedCount: 0,
        videoShootedCount: 0,
        modelCreatedCount: 0,
        totalInterviews: 0,
        candidatesWithInterviews: 0,
        offerLetterCount: 0
      };
      
      // Growth calculations
      const prevMonthStart = new Date(currentYear, currentMonth - 2, 1);
      const prevMonthEnd = new Date(currentYear, currentMonth - 1, 0, 23, 59, 59, 999);
      
      const prevYearStart = new Date(currentYear - 1, 0, 1);
      const prevYearEnd = new Date(currentYear - 1, 11, 31, 23, 59, 59, 999);
      
      const prevMonthStats = await getStatsSummary({
        createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd }
      });
      
      const prevYearStats = await getStatsSummary({
        createdAt: { $gte: prevYearStart, $lte: prevYearEnd }
      });
      
      // Calculate month-over-month growth
      const monthlyGrowth = {
        totalStudents: calculateGrowthPercentage(monthlyStats.totalStudents, prevMonthStats.totalStudents),
        financials: {
          totalAmount: calculateGrowthPercentage(monthlyStats.financials.totalAmount, prevMonthStats.financials.totalAmount),
          totalAmountReceived: calculateGrowthPercentage(monthlyStats.financials.totalAmountReceived, prevMonthStats.financials.totalAmountReceived)
        }
      };
      
      // Calculate year-over-year growth
      const yearlyGrowth = {
        totalStudents: calculateGrowthPercentage(yearlyStats.totalStudents, prevYearStats.totalStudents),
        financials: {
          totalAmount: calculateGrowthPercentage(yearlyStats.financials.totalAmount, prevYearStats.financials.totalAmount),
          totalAmountReceived: calculateGrowthPercentage(yearlyStats.financials.totalAmountReceived, prevYearStats.financials.totalAmountReceived)
        }
      };
      
      // Response object with comprehensive data for dashboard
      const dashboardData = {
        currentDate: now.toISOString(),
        overall: {
          totalStudents: allData.totalStudents,
          counts: {
            totalStudents: allData.totalStudents,
            status: {
              active: allData.activeCount,
              inactive: allData.inactiveCount,
              closed: allData.closedCount,
              completed: allData.completedCount
            },
            category: {
              placement: allData.placementCount,
              interview_support: allData.interviewSupportCount,
              document_services: allData.documentServicesCount,
              course_only: allData.courseOnlyCount
            },
            course: {
              software_development: allData.softwareDevCount,
              software_testing: allData.softwareTestingCount,
              othersCourse: allData.othersCourseCount
            }
          },
          financial: {
            totalAmount: allData.totalAmount,
            totalAmountReceived: allData.totalAmountReceived,
            totalBalanceAmount: allData.totalBalanceAmount,
            totalLoanAmount: allData.totalLoanAmount
          },
          lifecycle: {
            profileCreated: allData.profileCreatedCount,
            videoShooted: allData.videoShootedCount,
            modelCreated: allData.modelCreatedCount
          },
          interviews: {
            total: allData.totalInterviews,
            candidatesWithInterviews: allData.candidatesWithInterviews
          },
          offers: {
            total: allData.offerLetterCount
          }
        },
        yearly: {
          year: currentYear,
          stats: yearlyStats,
          growth: yearlyGrowth
        },
        monthly: {
          month: currentMonth,
          year: currentYear,
          stats: monthlyStats,
          growth: monthlyGrowth
        }
      };
      
      res.status(200).json(dashboardData);
    } catch (error) {
      console.error('Dashboard analytics error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }


