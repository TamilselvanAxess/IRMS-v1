// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Required field validation
export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

// Minimum length validation
export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

// Maximum length validation
export const validateMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

// Phone number validation
export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};

  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const rules = validationRules[field];

    if (rules.required && !validateRequired(value)) {
      errors[field] = `${field} is required`;
    } else if (value) {
      if (rules.email && !validateEmail(value)) {
        errors[field] = 'Invalid email format';
      }
      if (rules.password && !validatePassword(value)) {
        errors[field] = 'Password must be at least 8 characters with uppercase, lowercase, and number';
      }
      if (rules.minLength && !validateMinLength(value, rules.minLength)) {
        errors[field] = `${field} must be at least ${rules.minLength} characters`;
      }
      if (rules.maxLength && !validateMaxLength(value, rules.maxLength)) {
        errors[field] = `${field} must be no more than ${rules.maxLength} characters`;
      }
      if (rules.phone && !validatePhone(value)) {
        errors[field] = 'Invalid phone number format';
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 