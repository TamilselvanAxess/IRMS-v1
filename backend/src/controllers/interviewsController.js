import Candidate from "../models/candidate.model.js";

/**
 * Get interview and offer letter statistics (daily, weekly, monthly, yearly)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getInterviewStatistics = async (req, res) => {
  try {
    // Get query parameters with defaults
    const timeZone = req.query.timeZone || "UTC";
    
    // Get current date in the requested timezone
    const now = new Date();
    
    // Calculate date ranges
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday as start of week
    
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const startOfLastMonth = new Date(startOfMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    const startOfLastYear = new Date(startOfYear);
    startOfLastYear.setFullYear(startOfLastYear.getFullYear() - 1);

    // Aggregate pipeline for interview counts
    const interviewStats = await Candidate.aggregate([
      {
        $facet: {
          // Daily interviews (today)
          dailyInterviews: [
            {
              $match: {
                "interviews.interviewDateTime": { $gte: today, $lt: new Date(now) }
              }
            },
            {
              $project: {
                interviews: {
                  $filter: {
                    input: "$interviews",
                    as: "interview",
                    cond: {
                      $and: [
                        { $gte: ["$$interview.interviewDateTime", today] },
                        { $lt: ["$$interview.interviewDateTime", new Date(now)] }
                      ]
                    }
                  }
                }
              }
            },
            {
              $project: {
                interviewCount: { $size: "$interviews" }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: "$interviewCount" }
              }
            }
          ],
          
          // Yesterday's interviews
          yesterdayInterviews: [
            {
              $match: {
                "interviews.interviewDateTime": { $gte: yesterday, $lt: today }
              }
            },
            {
              $project: {
                interviews: {
                  $filter: {
                    input: "$interviews",
                    as: "interview",
                    cond: {
                      $and: [
                        { $gte: ["$$interview.interviewDateTime", yesterday] },
                        { $lt: ["$$interview.interviewDateTime", today] }
                      ]
                    }
                  }
                }
              }
            },
            {
              $project: {
                interviewCount: { $size: "$interviews" }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: "$interviewCount" }
              }
            }
          ],
          
          // Weekly interviews
          weeklyInterviews: [
            {
              $match: {
                "interviews.interviewDateTime": { $gte: startOfWeek, $lt: new Date(now) }
              }
            },
            {
              $project: {
                interviews: {
                  $filter: {
                    input: "$interviews",
                    as: "interview",
                    cond: {
                      $and: [
                        { $gte: ["$$interview.interviewDateTime", startOfWeek] },
                        { $lt: ["$$interview.interviewDateTime", new Date(now)] }
                      ]
                    }
                  }
                }
              }
            },
            {
              $project: {
                interviewCount: { $size: "$interviews" }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: "$interviewCount" }
              }
            }
          ],
          
          // Last week's interviews
          lastWeekInterviews: [
            {
              $match: {
                "interviews.interviewDateTime": { $gte: startOfLastWeek, $lt: startOfWeek }
              }
            },
            {
              $project: {
                interviews: {
                  $filter: {
                    input: "$interviews",
                    as: "interview",
                    cond: {
                      $and: [
                        { $gte: ["$$interview.interviewDateTime", startOfLastWeek] },
                        { $lt: ["$$interview.interviewDateTime", startOfWeek] }
                      ]
                    }
                  }
                }
              }
            },
            {
              $project: {
                interviewCount: { $size: "$interviews" }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: "$interviewCount" }
              }
            }
          ],
          
          // Monthly interviews
          monthlyInterviews: [
            {
              $match: {
                "interviews.interviewDateTime": { $gte: startOfMonth, $lt: new Date(now) }
              }
            },
            {
              $project: {
                interviews: {
                  $filter: {
                    input: "$interviews",
                    as: "interview",
                    cond: {
                      $and: [
                        { $gte: ["$$interview.interviewDateTime", startOfMonth] },
                        { $lt: ["$$interview.interviewDateTime", new Date(now)] }
                      ]
                    }
                  }
                }
              }
            },
            {
              $project: {
                interviewCount: { $size: "$interviews" }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: "$interviewCount" }
              }
            }
          ],
          
          // Last month's interviews
          lastMonthInterviews: [
            {
              $match: {
                "interviews.interviewDateTime": { $gte: startOfLastMonth, $lt: startOfMonth }
              }
            },
            {
              $project: {
                interviews: {
                  $filter: {
                    input: "$interviews",
                    as: "interview",
                    cond: {
                      $and: [
                        { $gte: ["$$interview.interviewDateTime", startOfLastMonth] },
                        { $lt: ["$$interview.interviewDateTime", startOfMonth] }
                      ]
                    }
                  }
                }
              }
            },
            {
              $project: {
                interviewCount: { $size: "$interviews" }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: "$interviewCount" }
              }
            }
          ],
          
          // Yearly interviews
          yearlyInterviews: [
            {
              $match: {
                "interviews.interviewDateTime": { $gte: startOfYear, $lt: new Date(now) }
              }
            },
            {
              $project: {
                interviews: {
                  $filter: {
                    input: "$interviews",
                    as: "interview",
                    cond: {
                      $and: [
                        { $gte: ["$$interview.interviewDateTime", startOfYear] },
                        { $lt: ["$$interview.interviewDateTime", new Date(now)] }
                      ]
                    }
                  }
                }
              }
            },
            {
              $project: {
                interviewCount: { $size: "$interviews" }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: "$interviewCount" }
              }
            }
          ],
          
          // Last year's interviews
          lastYearInterviews: [
            {
              $match: {
                "interviews.interviewDateTime": { $gte: startOfLastYear, $lt: startOfYear }
              }
            },
            {
              $project: {
                interviews: {
                  $filter: {
                    input: "$interviews",
                    as: "interview",
                    cond: {
                      $and: [
                        { $gte: ["$$interview.interviewDateTime", startOfLastYear] },
                        { $lt: ["$$interview.interviewDateTime", startOfYear] }
                      ]
                    }
                  }
                }
              }
            },
            {
              $project: {
                interviewCount: { $size: "$interviews" }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: "$interviewCount" }
              }
            }
          ]
        }
      }
    ]);

    // Aggregate pipeline for offer letter counts
    const offerLetterStats = await Candidate.aggregate([
      {
        $facet: {
          // Daily offer letters
          dailyOffers: [
            {
              $match: {
                offerLetterReceived: true,
                offerLetterReceivedDate: { $gte: today, $lt: new Date(now) }
              }
            },
            {
              $count: "count"
            }
          ],
          
          // Yesterday's offer letters
          yesterdayOffers: [
            {
              $match: {
                offerLetterReceived: true,
                offerLetterReceivedDate: { $gte: yesterday, $lt: today }
              }
            },
            {
              $count: "count"
            }
          ],
          
          // Weekly offer letters
          weeklyOffers: [
            {
              $match: {
                offerLetterReceived: true,
                offerLetterReceivedDate: { $gte: startOfWeek, $lt: new Date(now) }
              }
            },
            {
              $count: "count"
            }
          ],
          
          // Last week's offer letters
          lastWeekOffers: [
            {
              $match: {
                offerLetterReceived: true,
                offerLetterReceivedDate: { $gte: startOfLastWeek, $lt: startOfWeek }
              }
            },
            {
              $count: "count"
            }
          ],
          
          // Monthly offer letters
          monthlyOffers: [
            {
              $match: {
                offerLetterReceived: true,
                offerLetterReceivedDate: { $gte: startOfMonth, $lt: new Date(now) }
              }
            },
            {
              $count: "count"
            }
          ],
          
          // Last month's offer letters
          lastMonthOffers: [
            {
              $match: {
                offerLetterReceived: true,
                offerLetterReceivedDate: { $gte: startOfLastMonth, $lt: startOfMonth }
              }
            },
            {
              $count: "count"
            }
          ],
          
          // Yearly offer letters
          yearlyOffers: [
            {
              $match: {
                offerLetterReceived: true,
                offerLetterReceivedDate: { $gte: startOfYear, $lt: new Date(now) }
              }
            },
            {
              $count: "count"
            }
          ],
          
          // Last year's offer letters
          lastYearOffers: [
            {
              $match: {
                offerLetterReceived: true,
                offerLetterReceivedDate: { $gte: startOfLastYear, $lt: startOfYear }
              }
            },
            {
              $count: "count"
            }
          ]
        }
      }
    ]);

    // Format the results
    const formatStats = (stats, facetName) => {
      return stats[0][facetName].length > 0 ? stats[0][facetName][0].count : 0;
    };

    const response = {
      interviews: {
        today: formatStats(interviewStats, "dailyInterviews"),
        yesterday: formatStats(interviewStats, "yesterdayInterviews"),
        thisWeek: formatStats(interviewStats, "weeklyInterviews"),
        lastWeek: formatStats(interviewStats, "lastWeekInterviews"),
        thisMonth: formatStats(interviewStats, "monthlyInterviews"),
        lastMonth: formatStats(interviewStats, "lastMonthInterviews"),
        thisYear: formatStats(interviewStats, "yearlyInterviews"),
        lastYear: formatStats(interviewStats, "lastYearInterviews")
      },
      offerLetters: {
        today: offerLetterStats[0].dailyOffers.length > 0 ? offerLetterStats[0].dailyOffers[0].count : 0,
        yesterday: offerLetterStats[0].yesterdayOffers.length > 0 ? offerLetterStats[0].yesterdayOffers[0].count : 0,
        thisWeek: offerLetterStats[0].weeklyOffers.length > 0 ? offerLetterStats[0].weeklyOffers[0].count : 0,
        lastWeek: offerLetterStats[0].lastWeekOffers.length > 0 ? offerLetterStats[0].lastWeekOffers[0].count : 0,
        thisMonth: offerLetterStats[0].monthlyOffers.length > 0 ? offerLetterStats[0].monthlyOffers[0].count : 0,
        lastMonth: offerLetterStats[0].lastMonthOffers.length > 0 ? offerLetterStats[0].lastMonthOffers[0].count : 0,
        thisYear: offerLetterStats[0].yearlyOffers.length > 0 ? offerLetterStats[0].yearlyOffers[0].count : 0,
        lastYear: offerLetterStats[0].lastYearOffers.length > 0 ? offerLetterStats[0].lastYearOffers[0].count : 0
      },
      timeRanges: {
        today: { start: today, end: new Date(now) },
        yesterday: { start: yesterday, end: today },
        thisWeek: { start: startOfWeek, end: new Date(now) },
        lastWeek: { start: startOfLastWeek, end: startOfWeek },
        thisMonth: { start: startOfMonth, end: new Date(now) },
        lastMonth: { start: startOfLastMonth, end: startOfMonth },
        thisYear: { start: startOfYear, end: new Date(now) },
        lastYear: { start: startOfLastYear, end: startOfYear }
      },
      timestamp: new Date()
    };

    return res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error("Error fetching interview statistics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview statistics",
      error: error.message
    });
  }
};

/**
 * Get detailed interview statistics by result status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getInterviewResultStats = async (req, res) => {
  try {
    // Get time period from query params (default to "month")
    const period = req.query.period || "month";
    
    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case "day":
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Default to month
    }
    
    // Aggregate interviews by result status
    const resultStats = await Candidate.aggregate([
      {
        $unwind: "$interviews"
      },
      {
        $match: {
          "interviews.interviewDateTime": { $gte: startDate, $lt: now }
        }
      },
      {
        $group: {
          _id: "$interviews.result",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          status: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);
    
    // Calculate total interviews for the period
    const totalInterviews = resultStats.reduce((sum, item) => sum + item.count, 0);
    
    return res.status(200).json({
      success: true,
      data: {
        period,
        timeRange: { start: startDate, end: now },
        totalInterviews,
        resultBreakdown: resultStats
      }
    });
  } catch (error) {
    console.error("Error fetching interview result statistics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview result statistics",
      error: error.message
    });
  }
};