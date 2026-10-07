export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);
export const isStrongPassword = (pw) => pw.length >= 6;

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';
  else if (!isStrongPassword(password)) errors.password = 'Password must be at least 6 characters';
  return errors;
}

export function validateRegister({ fullName, email, phoneNumber, password, confirmPassword }) {
  const errors = {};
  if (!fullName || fullName.trim().length < 2) errors.fullName = 'Enter your full name';
  if (!email) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address';
  if (phoneNumber && !isValidPhone(phoneNumber)) errors.phoneNumber = 'Enter a valid 10-digit phone number';
  if (!password) errors.password = 'Password is required';
  else if (!isStrongPassword(password)) errors.password = 'Password must be at least 6 characters';
  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
}

export function validateContact({ name, email, message }) {
  const errors = {};
  if (!name) errors.name = 'Name is required';
  if (!email) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address';
  if (!message || message.trim().length < 10) errors.message = 'Message should be at least 10 characters';
  return errors;
}

export function validateBooking({ address, date, time }) {
  const errors = {};
  if (!address || address.trim().length < 5) errors.address = 'Enter a complete address';
  if (!date) errors.date = 'Select a preferred date';
  else if (new Date(date) < new Date().setHours(0, 0, 0, 0)) errors.date = 'Date cannot be in the past';
  if (!time) errors.time = 'Select a preferred time slot';
  return errors;
}

export function validatePasswordChange({ current, next, confirm }) {
  const errors = {};
  if (!current) errors.current = 'Enter your current password';
  if (!next) errors.next = 'Enter a new password';
  else if (!isStrongPassword(next)) errors.next = 'New password must be at least 6 characters';
  if (next !== confirm) errors.confirm = 'Passwords do not match';
  return errors;
}
