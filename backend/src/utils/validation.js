import Joi from 'joi';

/**
 * Validate candidate data
 */
export const validateCandidateData = (data, isUpdate = false) => {
  const requiredFields = isUpdate ? [] : ['fullName', 'email', 'phone', 'category'];
  
  const schema = Joi.object({
    // Basic Information
    fullName: Joi.string().min(2).max(100).messages({
      'string.min': 'Full name must be at least 2 characters long',
      'string.max': 'Full name cannot exceed 100 characters'
    }),
    email: Joi.string().email().messages({
      'string.email': 'Please provide a valid email address'
    }),
    phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
    candidateId: Joi.string().when('$isUpdate', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.forbidden()
    }),
    
    // Addresses
    addresses: Joi.object({
      permanent: Joi.string().max(500),
      current: Joi.string().max(500)
    }),
    
    // Status and Category
    status: Joi.string().valid('active', 'inactive', 'closed', 'completed'),
    paymentStatus: Joi.string().valid('paid', 'unpaid'),
    category: Joi.string().valid('placement', 'interview_support', 'document_services', 'course_only'),
    
    // Course Information
    course: Joi.string().valid('software_development', 'software_testing', 'othersCourse'),
    othersCourseName: Joi.string().max(100),
    
    // Inactive Information
    inactiveReason: Joi.string().max(500),
    inactiveDate: Joi.date(),
    comments: Joi.string().max(1000),
    documentsNonSubmissionReason: Joi.string().max(500),
    
    // Agent Information
    agentName: Joi.string().max(100),
    joiningDate: Joi.date(),
    
    // Contact Information
    contacts: Joi.object({
      father: Joi.object({
        name: Joi.string().max(100),
        phone: Joi.string().pattern(/^[0-9+\-\s()]+$/)
      }),
      mother: Joi.object({
        name: Joi.string().max(100),
        phone: Joi.string().pattern(/^[0-9+\-\s()]+$/)
      }),
      spouse: Joi.object({
        name: Joi.string().max(100),
        phone: Joi.string().pattern(/^[0-9+\-\s()]+$/)
      })
    }),
    
    // Training Information
    training: Joi.object({
      trainerName: Joi.string().max(100),
      trainerPhone: Joi.string().pattern(/^[0-9+\-\s()]+$/),
      slotTime: Joi.string().max(50),
      classStartDate: Joi.date(),
      courseEndDate: Joi.date(),
      stage: Joi.string().valid('training', 'poc', 'profileCreated', 'projects'),
      stageUpdateDate: Joi.date(),
      trainingStageDate: Joi.date(),
      projectsStageDate: Joi.date(),
      pocStageDate: Joi.date(),
      profileCreatedStageDate: Joi.date()
    }),
    
    // Education Documents
    education: Joi.object({
      sslc: Joi.string().max(200),
      hsc: Joi.string().max(200),
      ugDegree: Joi.string().max(200),
      ugMarksheet: Joi.string().max(200),
      ugProvisional: Joi.string().max(200),
      pgDegree: Joi.string().max(200)
    }),
    
    // Other Documents
    documents: Joi.object({
      eAadhar: Joi.string().max(200),
      panCard: Joi.string().max(200),
      photo: Joi.string().max(200),
      passport: Joi.string().max(200)
    }),
    
    // Profile Status
    profile: Joi.object({
      videoShooted: Joi.boolean(),
      videoShootedDate: Joi.date(),
      modelCreated: Joi.boolean(),
      modelCreatedDate: Joi.date(),
      resumeCreated: Joi.boolean(),
      resumeCreatedDate: Joi.date(),
      profileCreated: Joi.boolean(),
      profileCreatedDate: Joi.date()
    }),
    
    // Agreements
    agreements: Joi.object({
      entry: Joi.object({
        signed: Joi.boolean(),
        signedDate: Joi.date(),
        document: Joi.string().max(200)
      }),
      jobOffer: Joi.object({
        signed: Joi.boolean(),
        signedDate: Joi.date(),
        document: Joi.string().max(200)
      }),
      exit: Joi.object({
        signed: Joi.boolean(),
        signedDate: Joi.date(),
        document: Joi.string().max(200)
      })
    }),
    
    // Receipts
    receipts: Joi.object({
      entry: Joi.object({
        created: Joi.boolean(),
        createdDate: Joi.date(),
        document: Joi.string().max(200)
      }),
      jobOffer: Joi.object({
        created: Joi.boolean(),
        createdDate: Joi.date(),
        document: Joi.string().max(200)
      }),
      exit: Joi.object({
        created: Joi.boolean(),
        createdDate: Joi.date(),
        document: Joi.string().max(200)
      })
    }),
    
    // Financial Information
    financial: Joi.object({
      totalAmount: Joi.number().min(0),
      totalAmountReceived: Joi.number().min(0),
      balanceAmount: Joi.number().min(0),
      initialAmount: Joi.boolean(),
      initialAmountSplits: Joi.array().items(
        Joi.object({
          amount: Joi.number().min(0).required(),
          date: Joi.date(),
          comment: Joi.string().max(200)
        })
      ),
      balanceAmountSplits: Joi.array().items(
        Joi.object({
          amount: Joi.number().min(0).required(),
          date: Joi.date(),
          comment: Joi.string().max(200)
        })
      ),
      balanceAmountSplitsPaid: Joi.array().items(
        Joi.object({
          amount: Joi.number().min(0).required(),
          date: Joi.date(),
          comment: Joi.string().max(200)
        })
      ),
      paymentForInterview: Joi.number().min(0),
      paymentForInterviewDate: Joi.date(),
      paymentForDocuments: Joi.number().min(0),
      paymentForDocumentsDate: Joi.date(),
      paymentForOffer: Joi.number().min(0),
      paymentForOfferDate: Joi.date()
    }),
    
    // Interviews
    interviews: Joi.array().items(
      Joi.object({
        domain: Joi.string().max(100),
        interviewDateTime: Joi.date(),
        companyName: Joi.string().max(100),
        interviewLevel: Joi.string().max(50),
        interviewerName: Joi.string().max(100),
        proxyName: Joi.string().max(100),
        hrName: Joi.string().max(100),
        hrEmail: Joi.string().email(),
        hrPhone: Joi.string().pattern(/^[0-9+\-\s()]+$/),
        status: Joi.string().max(50),
        rescheduledDateTime: Joi.date(),
        statusRemarks: Joi.string().max(500),
        result: Joi.string().max(50),
        resultRemarks: Joi.string().max(500)
      })
    ),
    
    // Offers
    offers: Joi.array().items(
      Joi.object({
        offerLetterReceived: Joi.boolean(),
        offerLetterReceivedDate: Joi.date(),
        offerLetterDoc: Joi.string().max(200),
        companyName: Joi.string().max(100),
        companyAddress: Joi.string().max(500),
        hrName: Joi.string().max(100),
        hrPhone: Joi.string().pattern(/^[0-9+\-\s()]+$/),
        hrEmail: Joi.string().email(),
        onboarded: Joi.boolean(),
        onboardedDate: Joi.date()
      })
    ),
    
    // Loans
    loans: Joi.array().items(
      Joi.object({
        loan: Joi.boolean(),
        distributedAmount: Joi.number().min(0),
        distributedDate: Joi.date()
      })
    ),
    
    // Metadata
    referredBy: Joi.string().max(100)
  }).required().messages({
    'object.unknown': 'Unknown field: {{#label}}'
  });

  const { error, value } = schema.validate(data, {
    abortEarly: false,
    context: { isUpdate }
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return {
      isValid: false,
      errors
    };
  }

  return {
    isValid: true,
    data: value
  };
};

/**
 * Validate user data
 */
export const validateUserData = (data, isUpdate = false) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters'
    }),
    email: Joi.string().email().messages({
      'string.email': 'Please provide a valid email address'
    }),
    password: isUpdate ? Joi.string().min(6).optional() : Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
    role: Joi.string().valid('admin', 'user', 'manager'),
    phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).messages({
      'string.pattern.base': 'Please provide a valid phone number'
    })
  });

  const { error, value } = schema.validate(data, {
    abortEarly: false
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return {
      isValid: false,
      errors
    };
  }

  return {
    isValid: true,
    data: value
  };
};

/**
 * Validate interview data
 */
export const validateInterviewData = (data) => {
  const schema = Joi.object({
    domain: Joi.string().max(100).required().messages({
      'any.required': 'Domain is required'
    }),
    interviewDateTime: Joi.date().required().messages({
      'any.required': 'Interview date and time is required'
    }),
    companyName: Joi.string().max(100).required().messages({
      'any.required': 'Company name is required'
    }),
    interviewLevel: Joi.string().max(50),
    interviewerName: Joi.string().max(100),
    proxyName: Joi.string().max(100),
    hrName: Joi.string().max(100),
    hrEmail: Joi.string().email(),
    hrPhone: Joi.string().pattern(/^[0-9+\-\s()]+$/),
    status: Joi.string().max(50),
    rescheduledDateTime: Joi.date(),
    statusRemarks: Joi.string().max(500),
    result: Joi.string().max(50),
    resultRemarks: Joi.string().max(500)
  });

  const { error, value } = schema.validate(data, {
    abortEarly: false
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return {
      isValid: false,
      errors
    };
  }

  return {
    isValid: true,
    data: value
  };
};

/**
 * Validate offer data
 */
export const validateOfferData = (data) => {
  const schema = Joi.object({
    offerLetterReceived: Joi.boolean(),
    offerLetterReceivedDate: Joi.date(),
    offerLetterDoc: Joi.string().max(200),
    companyName: Joi.string().max(100).required().messages({
      'any.required': 'Company name is required'
    }),
    companyAddress: Joi.string().max(500),
    hrName: Joi.string().max(100),
    hrPhone: Joi.string().pattern(/^[0-9+\-\s()]+$/),
    hrEmail: Joi.string().email(),
    onboarded: Joi.boolean(),
    onboardedDate: Joi.date()
  });

  const { error, value } = schema.validate(data, {
    abortEarly: false
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return {
      isValid: false,
      errors
    };
  }

  return {
    isValid: true,
    data: value
  };
};

/**
 * Validate financial data
 */
export const validateFinancialData = (data) => {
  const schema = Joi.object({
    totalAmount: Joi.number().min(0),
    totalAmountReceived: Joi.number().min(0),
    balanceAmount: Joi.number().min(0),
    initialAmount: Joi.boolean(),
    initialAmountSplits: Joi.array().items(
      Joi.object({
        amount: Joi.number().min(0).required(),
        date: Joi.date(),
        comment: Joi.string().max(200)
      })
    ),
    balanceAmountSplits: Joi.array().items(
      Joi.object({
        amount: Joi.number().min(0).required(),
        date: Joi.date(),
        comment: Joi.string().max(200)
      })
    ),
    balanceAmountSplitsPaid: Joi.array().items(
      Joi.object({
        amount: Joi.number().min(0).required(),
        date: Joi.date(),
        comment: Joi.string().max(200)
      })
    ),
    paymentForInterview: Joi.number().min(0),
    paymentForInterviewDate: Joi.date(),
    paymentForDocuments: Joi.number().min(0),
    paymentForDocumentsDate: Joi.date(),
    paymentForOffer: Joi.number().min(0),
    paymentForOfferDate: Joi.date()
  });

  const { error, value } = schema.validate(data, {
    abortEarly: false
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return {
      isValid: false,
      errors
    };
  }

  return {
    isValid: true,
    data: value
  };
}; 