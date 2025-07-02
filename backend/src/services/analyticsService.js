import Candidate from '../models/candidate.model.js';
import moment from 'moment';

class AnalyticsService {
  /**
   * Get daily analytics data
   */
  async getDailyAnalytics(startDate, endDate, days = 7) {
    try {
      const endDateTime = endDate ? new Date(endDate) : new Date();
      endDateTime.setHours(23, 59, 59, 999);
      
      const startDateTime = startDate 
        ? new Date(startDate) 
        : new Date(endDateTime);
      startDateTime.setDate(startDateTime.getDate() - (days - 1));
      startDateTime.setHours(0, 0, 0, 0);
      
      const dailyData = [];
      const currentDate = new Date(startDateTime);
      
      while (currentDate <= endDateTime) {
        const dayStart = new Date(currentDate);
        dayStart.setHours(0, 0, 0, 0);
        
        const dayEnd = new Date(currentDate);
        dayEnd.setHours(23, 59, 59, 999);
        
        const dayCounts = await Candidate.aggregate([
          {
            $match: {
              joiningDate: { $gte: dayStart, $lte: dayEnd }
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
              totalAmount: { $sum: { $ifNull: ["$financial.totalAmount", "$totalAmount", 0] } },
              totalReceived: { $sum: { $ifNull: ["$financial.totalAmountReceived", "$totalAmountReceived", 0] } },
              totalBalance: { $sum: { $ifNull: ["$financial.balanceAmount", "$balanceAmount", 0] } },
              totalLoan: {
                $sum: {
                  $reduce: {
                    input: { $ifNull: ["$loans", []] },
                    initialValue: 0,
                    in: { $add: ["$$value", { $ifNull: ["$$this.distributedAmount", 0] }] }
                  }
                }
              },
              initialAmountCount: { $sum: { $cond: [{ $eq: ["$financial.initialAmount", true] }, 1, 0] } },
              profileCreatedCount: { $sum: { $cond: [{ $eq: ["$profile.profileCreated", true] }, 1, 0] } },
              videoShootedCount: { $sum: { $cond: [{ $eq: ["$profile.videoShooted", true] }, 1, 0] } },
              modelCreatedCount: { $sum: { $cond: [{ $eq: ["$profile.modelCreated", true] }, 1, 0] } },
              totalInterviews: { $sum: { $size: { $ifNull: ["$interviews", []] } } },
              candidatesWithInterviews: {
                $sum: { $cond: [{ $gt: [{ $size: { $ifNull: ["$interviews", []] } }, 0] }, 1, 0] }
              },
              offerLetterCount: { 
                $sum: { 
                  $size: { 
                    $filter: { 
                      input: { $ifNull: ["$offers", []] }, 
                      cond: { $eq: ["$$this.offerLetterReceived", true] } 
                    } 
                  } 
                } 
              }
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
            totalLoan: dayData.totalLoan,
            initialAmountCount: dayData.initialAmountCount
          },
          profile: {
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
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return {
        dateRange: `${startDateTime.toISOString().split('T')[0]} to ${endDateTime.toISOString().split('T')[0]}`,
        dailyData
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get weekly analytics data
   */
  async getWeeklyAnalytics(startDate, endDate, weeks = 4) {
    try {
      const endDateTime = endDate ? new Date(endDate) : new Date();
      const startDateTime = startDate 
        ? new Date(startDate) 
        : moment(endDateTime).subtract(weeks, 'weeks').toDate();
      
      const weeklyData = [];
      const currentDate = new Date(startDateTime);
      
      while (currentDate <= endDateTime) {
        const weekStart = moment(currentDate).startOf('week').toDate();
        const weekEnd = moment(currentDate).endOf('week').toDate();
        
        const weekCounts = await Candidate.aggregate([
          {
            $match: {
              joiningDate: { $gte: weekStart, $lte: weekEnd }
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
              totalAmount: { $sum: { $ifNull: ["$financial.totalAmount", "$totalAmount", 0] } },
              totalReceived: { $sum: { $ifNull: ["$financial.totalAmountReceived", "$totalAmountReceived", 0] } },
              totalBalance: { $sum: { $ifNull: ["$financial.balanceAmount", "$balanceAmount", 0] } },
              totalInterviews: { $sum: { $size: { $ifNull: ["$interviews", []] } } },
              offerLetterCount: { 
                $sum: { 
                  $size: { 
                    $filter: { 
                      input: { $ifNull: ["$offers", []] }, 
                      cond: { $eq: ["$$this.offerLetterReceived", true] } 
                    } 
                  } 
                } 
              }
            }
          }
        ]);
        
        const weekData = weekCounts[0] || {
          totalCount: 0, activeCount: 0, inactiveCount: 0, closedCount: 0, completedCount: 0,
          placementCount: 0, interviewSupportCount: 0, documentServicesCount: 0, courseOnlyCount: 0,
          totalAmount: 0, totalReceived: 0, totalBalance: 0,
          totalInterviews: 0, offerLetterCount: 0
        };
        
        weeklyData.push({
          week: moment(weekStart).format('YYYY-[W]WW'),
          weekStart: weekStart.toISOString().split('T')[0],
          weekEnd: weekEnd.toISOString().split('T')[0],
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
            }
          },
          financial: {
            totalAmount: weekData.totalAmount,
            totalAmountReceived: weekData.totalReceived,
            totalBalanceAmount: weekData.totalBalance
          },
          interviews: {
            total: weekData.totalInterviews
          },
          offers: {
            total: weekData.offerLetterCount
          }
        });
        
        currentDate.setDate(currentDate.getDate() + 7);
      }
      
      return {
        dateRange: `${startDateTime.toISOString().split('T')[0]} to ${endDateTime.toISOString().split('T')[0]}`,
        weeklyData
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get monthly analytics data
   */
  async getMonthlyAnalytics(startDate, endDate, months = 12) {
    try {
      const endDateTime = endDate ? new Date(endDate) : new Date();
      const startDateTime = startDate 
        ? new Date(startDate) 
        : moment(endDateTime).subtract(months, 'months').toDate();
      
      const monthlyData = [];
      const currentDate = new Date(startDateTime);
      
      while (currentDate <= endDateTime) {
        const monthStart = moment(currentDate).startOf('month').toDate();
        const monthEnd = moment(currentDate).endOf('month').toDate();
        
        const monthCounts = await Candidate.aggregate([
          {
            $match: {
              joiningDate: { $gte: monthStart, $lte: monthEnd }
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
              totalAmount: { $sum: { $ifNull: ["$financial.totalAmount", "$totalAmount", 0] } },
              totalReceived: { $sum: { $ifNull: ["$financial.totalAmountReceived", "$totalAmountReceived", 0] } },
              totalBalance: { $sum: { $ifNull: ["$financial.balanceAmount", "$balanceAmount", 0] } },
              totalInterviews: { $sum: { $size: { $ifNull: ["$interviews", []] } } },
              offerLetterCount: { 
                $sum: { 
                  $size: { 
                    $filter: { 
                      input: { $ifNull: ["$offers", []] }, 
                      cond: { $eq: ["$$this.offerLetterReceived", true] } 
                    } 
                  } 
                } 
              }
            }
          }
        ]);
        
        const monthData = monthCounts[0] || {
          totalCount: 0, activeCount: 0, inactiveCount: 0, closedCount: 0, completedCount: 0,
          placementCount: 0, interviewSupportCount: 0, documentServicesCount: 0, courseOnlyCount: 0,
          totalAmount: 0, totalReceived: 0, totalBalance: 0,
          totalInterviews: 0, offerLetterCount: 0
        };
        
        monthlyData.push({
          month: moment(monthStart).format('YYYY-MM'),
          monthName: moment(monthStart).format('MMMM YYYY'),
          monthStart: monthStart.toISOString().split('T')[0],
          monthEnd: monthEnd.toISOString().split('T')[0],
          counts: {
            totalStudents: monthData.totalCount,
            status: {
              active: monthData.activeCount,
              inactive: monthData.inactiveCount,
              closed: monthData.closedCount,
              completed: monthData.completedCount
            },
            category: {
              placement: monthData.placementCount,
              interview_support: monthData.interviewSupportCount,
              document_services: monthData.documentServicesCount,
              course_only: monthData.courseOnlyCount
            }
          },
          financial: {
            totalAmount: monthData.totalAmount,
            totalAmountReceived: monthData.totalReceived,
            totalBalanceAmount: monthData.totalBalance
          },
          interviews: {
            total: monthData.totalInterviews
          },
          offers: {
            total: monthData.offerLetterCount
          }
        });
        
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      
      return {
        dateRange: `${startDateTime.toISOString().split('T')[0]} to ${endDateTime.toISOString().split('T')[0]}`,
        monthlyData
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get yearly analytics data
   */
  async getYearlyAnalytics(startYear, endYear) {
    try {
      const endYearNum = endYear || new Date().getFullYear();
      const startYearNum = startYear || endYearNum - 5;
      
      const yearlyData = [];
      
      for (let year = startYearNum; year <= endYearNum; year++) {
        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);
        
        const yearCounts = await Candidate.aggregate([
          {
            $match: {
              joiningDate: { $gte: yearStart, $lte: yearEnd }
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
              totalAmount: { $sum: { $ifNull: ["$financial.totalAmount", "$totalAmount", 0] } },
              totalReceived: { $sum: { $ifNull: ["$financial.totalAmountReceived", "$totalAmountReceived", 0] } },
              totalBalance: { $sum: { $ifNull: ["$financial.balanceAmount", "$balanceAmount", 0] } },
              totalInterviews: { $sum: { $size: { $ifNull: ["$interviews", []] } } },
              offerLetterCount: { 
                $sum: { 
                  $size: { 
                    $filter: { 
                      input: { $ifNull: ["$offers", []] }, 
                      cond: { $eq: ["$$this.offerLetterReceived", true] } 
                    } 
                  } 
                } 
              }
            }
          }
        ]);
        
        const yearData = yearCounts[0] || {
          totalCount: 0, activeCount: 0, inactiveCount: 0, closedCount: 0, completedCount: 0,
          placementCount: 0, interviewSupportCount: 0, documentServicesCount: 0, courseOnlyCount: 0,
          totalAmount: 0, totalReceived: 0, totalBalance: 0,
          totalInterviews: 0, offerLetterCount: 0
        };
        
        yearlyData.push({
          year: year.toString(),
          yearStart: yearStart.toISOString().split('T')[0],
          yearEnd: yearEnd.toISOString().split('T')[0],
          counts: {
            totalStudents: yearData.totalCount,
            status: {
              active: yearData.activeCount,
              inactive: yearData.inactiveCount,
              closed: yearData.closedCount,
              completed: yearData.completedCount
            },
            category: {
              placement: yearData.placementCount,
              interview_support: yearData.interviewSupportCount,
              document_services: yearData.documentServicesCount,
              course_only: yearData.courseOnlyCount
            }
          },
          financial: {
            totalAmount: yearData.totalAmount,
            totalAmountReceived: yearData.totalReceived,
            totalBalanceAmount: yearData.totalBalance
          },
          interviews: {
            total: yearData.totalInterviews
          },
          offers: {
            total: yearData.offerLetterCount
          }
        });
      }
      
      return {
        yearRange: `${startYearNum} to ${endYearNum}`,
        yearlyData
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get dashboard summary statistics
   */
  async getDashboardSummary() {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      
      const [totalStats, monthlyStats, yearlyStats] = await Promise.all([
        // Total statistics
        Candidate.aggregate([
          {
            $group: {
              _id: null,
              totalCandidates: { $sum: 1 },
              activeCandidates: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
              inactiveCandidates: { $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] } },
              closedCandidates: { $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] } },
              completedCandidates: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
              totalAmount: { $sum: { $ifNull: ["$financial.totalAmount", "$totalAmount", 0] } },
              totalReceived: { $sum: { $ifNull: ["$financial.totalAmountReceived", "$totalAmountReceived", 0] } },
              totalBalance: { $sum: { $ifNull: ["$financial.balanceAmount", "$balanceAmount", 0] } },
              totalInterviews: { $sum: { $size: { $ifNull: ["$interviews", []] } } },
              totalOffers: { 
                $sum: { 
                  $size: { 
                    $filter: { 
                      input: { $ifNull: ["$offers", []] }, 
                      cond: { $eq: ["$$this.offerLetterReceived", true] } 
                    } 
                  } 
                } 
              }
            }
          }
        ]),
        
        // Monthly statistics
        Candidate.aggregate([
          {
            $match: {
              joiningDate: { $gte: startOfMonth }
            }
          },
          {
            $group: {
              _id: null,
              monthlyCandidates: { $sum: 1 },
              monthlyAmount: { $sum: { $ifNull: ["$financial.totalAmount", "$totalAmount", 0] } },
              monthlyReceived: { $sum: { $ifNull: ["$financial.totalAmountReceived", "$totalAmountReceived", 0] } }
            }
          }
        ]),
        
        // Yearly statistics
        Candidate.aggregate([
          {
            $match: {
              joiningDate: { $gte: startOfYear }
            }
          },
          {
            $group: {
              _id: null,
              yearlyCandidates: { $sum: 1 },
              yearlyAmount: { $sum: { $ifNull: ["$financial.totalAmount", "$totalAmount", 0] } },
              yearlyReceived: { $sum: { $ifNull: ["$financial.totalAmountReceived", "$totalAmountReceived", 0] } }
            }
          }
        ])
      ]);
      
      const total = totalStats[0] || {
        totalCandidates: 0, activeCandidates: 0, inactiveCandidates: 0, 
        closedCandidates: 0, completedCandidates: 0,
        totalAmount: 0, totalReceived: 0, totalBalance: 0,
        totalInterviews: 0, totalOffers: 0
      };
      
      const monthly = monthlyStats[0] || {
        monthlyCandidates: 0, monthlyAmount: 0, monthlyReceived: 0
      };
      
      const yearly = yearlyStats[0] || {
        yearlyCandidates: 0, yearlyAmount: 0, yearlyReceived: 0
      };
      
      return {
        total,
        monthly,
        yearly,
        generatedAt: now.toISOString()
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get category-wise statistics
   */
  async getCategoryStats() {
    try {
      const categoryStats = await Candidate.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            activeCount: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
            totalAmount: { $sum: { $ifNull: ["$financial.totalAmount", 0] } },
            totalReceived: { $sum: { $ifNull: ["$financial.totalAmountReceived", 0] } }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);
      
      return categoryStats;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get course-wise statistics
   */
  async getCourseStats() {
    try {
      const courseStats = await Candidate.aggregate([
        {
          $match: {
            course: { $exists: true, $ne: null }
          }
        },
        {
          $group: {
            _id: "$course",
            count: { $sum: 1 },
            activeCount: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
            totalAmount: { $sum: { $ifNull: ["$financial.totalAmount", 0] } }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);
      
      return courseStats;
    } catch (error) {
      throw error;
    }
  }
}

export default new AnalyticsService(); 