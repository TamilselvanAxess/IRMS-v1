import Candidate from "../models/candidate.model.js";

/**
 * Helper function to get statistics summary for a given filter
 */
export const getStatsSummary = async (filter) => {
    // Get overall counts
    const totalStudents = await Candidate.countDocuments(filter);
    
    // Status counts
    const statusCounts = await Candidate.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Category counts
    const categoryCounts = await Candidate.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Course counts
    const courseCounts = await Candidate.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$course',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Financial data
    const financialData = await Candidate.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $ifNull: ['$financial.totalAmount', 0] } },
          totalAmountReceived: { $sum: { $ifNull: ['$financial.totalAmountReceived', 0] } },
          balanceAmount: { $sum: { $ifNull: ['$financial.balanceAmount', 0] } },
          loanAmount: { $sum: { $cond: [{ $eq: ['$loan', true] }, { $ifNull: ['$loanDistrubutedAmount', 0] }, 0] } }
        }
      }
    ]);
    
    // Lifecycle counts
    const profileCreated = await Candidate.countDocuments({ ...filter, profileCreated: true });
    const videoShooted = await Candidate.countDocuments({ ...filter, videoShooted: true });
    const modelCreated = await Candidate.countDocuments({ ...filter, modelCreated: true });
    const initialAmount = await Candidate.countDocuments({ ...filter, initialAmount: true });
    
    // Convert to map for easier access
    const statusMap = statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
    
    const categoryMap = categoryCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
    
    const courseMap = courseCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
    
    // Compile results
    return {
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
        software_testing: courseMap.software_testing || 0
      },
      financials: {
        totalAmount: financialData[0]?.totalAmount || 0,
        totalAmountReceived: financialData[0]?.totalAmountReceived || 0,
        balanceAmount: financialData[0]?.balanceAmount || 0,
        loanAmount: financialData[0]?.loanAmount || 0
      },
      lifecycle: {
        profileCreated,
        videoShooted,
        modelCreated
      },
      payments: {
        initialAmount
      }
    };
  }
  
  /**
   * Helper function to calculate growth percentage
   */
  export const calculateGrowthPercentage = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous * 100).toFixed(2);
  }