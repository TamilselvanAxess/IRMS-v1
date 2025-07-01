import Candidate from '../models/candidate.model.js';
import generateUniqueId from '../utils/generateUniqueId.js';
import { sendCandidateRegistrationEmail } from '../utils/emailService.js';
import { addPaymentToCalendar } from './calendarService.js';

class CandidateService {
  /**
   * Create a new candidate
   */
  async createCandidate(candidateData, userId) {
    try {
      // Check for existing candidate
      const existingCandidate = await Candidate.findOne({ email: candidateData.email });
      if (existingCandidate) {
        throw new Error('Candidate with this email already exists');
      }

      // Generate unique ID
      const candidateId = await generateUniqueId('SID');
      
      // Create candidate
      const candidate = await Candidate.create({
        ...candidateData,
        candidateId,
        createdBy: userId
      });

      // Send email notification
      try {
        await sendCandidateRegistrationEmail(candidate);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the operation if email fails
      }

      return candidate;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all candidates with filtering and pagination
   */
  async getCandidates(filters = {}, page = 1, limit = 10) {
    try {
      const query = this.buildQuery(filters);
      const skip = (page - 1) * limit;

      const [candidates, total] = await Promise.all([
        Candidate.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('createdBy', 'name email')
          .populate('updatedBy', 'name email'),
        Candidate.countDocuments(query)
      ]);

      return {
        candidates,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get candidate by ID
   */
  async getCandidateById(candidateId) {
    try {
      const candidate = await Candidate.findOne({ candidateId })
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email');

      if (!candidate) {
        throw new Error('Candidate not found');
      }

      return candidate;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update candidate
   */
  async updateCandidate(candidateId, updateData, userId) {
    try {
      const candidate = await Candidate.findOneAndUpdate(
        { candidateId },
        { ...updateData, updatedBy: userId },
        { new: true, runValidators: true }
      ).populate('createdBy', 'name email')
       .populate('updatedBy', 'name email');

      if (!candidate) {
        throw new Error('Candidate not found');
      }

      return candidate;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete candidate
   */
  async deleteCandidate(candidateId) {
    try {
      const candidate = await Candidate.findOneAndDelete({ candidateId });
      
      if (!candidate) {
        throw new Error('Candidate not found');
      }

      return { message: 'Candidate deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change candidate status
   */
  async changeStatus(candidateId, status, reason, userId) {
    try {
      const updateData = { 
        status, 
        updatedBy: userId 
      };

      if (status === 'inactive') {
        updateData.inactiveReason = reason;
        updateData.inactiveDate = new Date();
      }

      const candidate = await Candidate.findOneAndUpdate(
        { candidateId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!candidate) {
        throw new Error('Candidate not found');
      }

      return candidate;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add interview to candidate
   */
  async addInterview(candidateId, interviewData, userId) {
    try {
      const candidate = await Candidate.findOneAndUpdate(
        { candidateId },
        { 
          $push: { interviews: interviewData },
          updatedBy: userId 
        },
        { new: true, runValidators: true }
      );

      if (!candidate) {
        throw new Error('Candidate not found');
      }

      return candidate;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add offer to candidate
   */
  async addOffer(candidateId, offerData, userId) {
    try {
      const candidate = await Candidate.findOneAndUpdate(
        { candidateId },
        { 
          $push: { offers: offerData },
          updatedBy: userId 
        },
        { new: true, runValidators: true }
      );

      if (!candidate) {
        throw new Error('Candidate not found');
      }

      return candidate;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update financial information
   */
  async updateFinancial(candidateId, financialData, userId) {
    try {
      const candidate = await Candidate.findOneAndUpdate(
        { candidateId },
        { 
          $set: { 
            financial: { ...financialData },
            updatedBy: userId 
          }
        },
        { new: true, runValidators: true }
      );

      if (!candidate) {
        throw new Error('Candidate not found');
      }

      // Add payment to calendar if it's a future payment
      if (financialData.balanceAmountSplits) {
        const futurePayments = financialData.balanceAmountSplits.filter(
          payment => new Date(payment.date) > new Date()
        );

        for (const payment of futurePayments) {
          try {
            await addPaymentToCalendar(
              candidate.candidateId,
              candidate.fullName,
              payment.amount,
              payment.date
            );
          } catch (calendarError) {
            console.error('Calendar integration failed:', calendarError);
          }
        }
      }

      return candidate;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Build query based on filters
   */
  buildQuery(filters) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.course) {
      query.course = filters.course;
    }

    if (filters.agentName) {
      query.agentName = { $regex: filters.agentName, $options: 'i' };
    }

    if (filters.fullName) {
      query.fullName = { $regex: filters.fullName, $options: 'i' };
    }

    if (filters.email) {
      query.email = { $regex: filters.email, $options: 'i' };
    }

    if (filters.candidateId) {
      query.candidateId = { $regex: filters.candidateId, $options: 'i' };
    }

    if (filters.joiningDateFrom || filters.joiningDateTo) {
      query.joiningDate = {};
      if (filters.joiningDateFrom) {
        query.joiningDate.$gte = new Date(filters.joiningDateFrom);
      }
      if (filters.joiningDateTo) {
        query.joiningDate.$lte = new Date(filters.joiningDateTo);
      }
    }

    if (filters.paymentStatus) {
      query.paymentStatus = filters.paymentStatus;
    }

    return query;
  }

  /**
   * Get candidate statistics
   */
  async getStatistics() {
    try {
      const stats = await Candidate.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            inactive: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } },
            closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            placement: { $sum: { $cond: [{ $eq: ['$category', 'placement'] }, 1, 0] } },
            interviewSupport: { $sum: { $cond: [{ $eq: ['$category', 'interview_support'] }, 1, 0] } },
            documentServices: { $sum: { $cond: [{ $eq: ['$category', 'document_services'] }, 1, 0] } },
            courseOnly: { $sum: { $cond: [{ $eq: ['$category', 'course_only'] }, 1, 0] } },
            totalAmount: { $sum: { $ifNull: ['$financial.totalAmount', 0] } },
            totalReceived: { $sum: { $ifNull: ['$financial.totalAmountReceived', 0] } },
            totalBalance: { $sum: { $ifNull: ['$financial.balanceAmount', 0] } }
          }
        }
      ]);

      return stats[0] || {
        total: 0, active: 0, inactive: 0, closed: 0, completed: 0,
        placement: 0, interviewSupport: 0, documentServices: 0, courseOnly: 0,
        totalAmount: 0, totalReceived: 0, totalBalance: 0
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new CandidateService(); 