import candidateService from '../services/candidateService.js';
import { validateCandidateData } from '../utils/validation.js';

/**
 * @desc    Create a new candidate
 * @route   POST /api/candidates/add-candidate
 * @access  Private
 */
export const addCandidate = async (req, res, next) => {
  try {
    // Validate input data
    const validation = validateCandidateData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Create candidate using service
    const candidate = await candidateService.createCandidate(req.body, req.user._id);

    res.status(201).json({
      success: true,
      message: 'Candidate added successfully',
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all candidates with filtering and pagination
 * @route   GET /api/candidates/get-all-candidates
 * @access  Private
 */
export const getAllCandidates = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    
    const result = await candidateService.getCandidates(
      filters, 
      parseInt(page), 
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      message: 'Candidates retrieved successfully',
      data: result.candidates,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get candidate by ID
 * @route   GET /api/candidates/get-candidate-by-id/:candidateId
 * @access  Private
 */
export const getCandidateById = async (req, res, next) => {
  try {
    const { candidateId } = req.params;
    
    const candidate = await candidateService.getCandidateById(candidateId);

    res.status(200).json({
      success: true,
      message: 'Candidate retrieved successfully',
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update candidate
 * @route   PUT /api/candidates/update-candidate/:candidateId
 * @access  Private
 */
export const updateCandidate = async (req, res, next) => {
  try {
    const { candidateId } = req.params;
    
    // Validate update data
    const validation = validateCandidateData(req.body, true);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const candidate = await candidateService.updateCandidate(
      candidateId, 
      req.body, 
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: 'Candidate updated successfully',
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete candidate
 * @route   DELETE /api/candidates/delete-candidate/:candidateId
 * @access  Private
 */
export const deleteCandidate = async (req, res, next) => {
  try {
    const { candidateId } = req.params;
    
    const result = await candidateService.deleteCandidate(candidateId);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change candidate status
 * @route   PUT /api/candidates/change-candidate-status/:candidateId
 * @access  Private
 */
export const changeCandidateStatus = async (req, res, next) => {
  try {
    const { candidateId } = req.params;
    const { status, reason } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const candidate = await candidateService.changeStatus(
      candidateId, 
      status, 
      reason, 
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: 'Candidate status updated successfully',
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add interview to candidate
 * @route   POST /api/candidates/:candidateId/interviews
 * @access  Private
 */
export const addInterview = async (req, res, next) => {
  try {
    const { candidateId } = req.params;
    
    const candidate = await candidateService.addInterview(
      candidateId, 
      req.body, 
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: 'Interview added successfully',
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add offer to candidate
 * @route   POST /api/candidates/:candidateId/offers
 * @access  Private
 */
export const addOffer = async (req, res, next) => {
  try {
    const { candidateId } = req.params;
    
    const candidate = await candidateService.addOffer(
      candidateId, 
      req.body, 
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: 'Offer added successfully',
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update candidate financial information
 * @route   PUT /api/candidates/:candidateId/financial
 * @access  Private
 */
export const updateFinancial = async (req, res, next) => {
  try {
    const { candidateId } = req.params;
    
    const candidate = await candidateService.updateFinancial(
      candidateId, 
      req.body, 
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: 'Financial information updated successfully',
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get candidate statistics
 * @route   GET /api/candidates/statistics
 * @access  Private
 */
export const getStatistics = async (req, res, next) => {
  try {
    const stats = await candidateService.getStatistics();

    res.status(200).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    next(error);
  }
}; 