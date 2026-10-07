const validator = require('validator');

/**
 * Validates registration input with strict email format verification
 */
const validateRegistration = (data) => {
  const errors = [];
  const { name, email, phone, password, confirmPassword } = data || {};

  // Name validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Full name is required and must be at least 2 characters long');
  }

  // Email validation: rejects abc, abc@, hello@, test, hello@gmail, etc.
  if (!email || typeof email !== 'string') {
    errors.push('Email address is required');
  } else {
    const trimmedEmail = email.trim().toLowerCase();
    // Use validator.isEmail and ensure it contains a dot in the domain part
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!validator.isEmail(trimmedEmail) || !emailRegex.test(trimmedEmail)) {
      errors.push(
        'Please enter a valid email address with a valid domain (e.g. user@example.com)'
      );
    }
  }

  // Password validation
  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  // Password confirmation check
  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates login input
 */
const validateLogin = (data) => {
  const errors = [];
  const { email, password } = data || {};

  if (!email || typeof email !== 'string' || !validator.isEmail(email.trim())) {
    errors.push('A valid email address is required');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateRegistration,
  validateLogin,
};
