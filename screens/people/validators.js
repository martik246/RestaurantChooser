export const validateFirstName = (firstName) => {
  const trimmedFirstName = firstName.trim();

  if (!trimmedFirstName) {
    return 'First name is required';
  }

  if (trimmedFirstName.length < 2) {
    return 'First name must be at least 2 characters long';
  }

  // Allow names in both Latin and Cyrillic alphabets.
  if (!/^[\p{L}' -]+$/u.test(trimmedFirstName)) {
    return 'First name contains invalid characters';
  }

  return null;
};

export const validateLastName = (lastName) => {
  const trimmedLastName = lastName.trim();

  if (!trimmedLastName) {
    return 'Last name is required';
  }

  if (trimmedLastName.length < 2) {
    return 'Last name must be at least 2 characters long';
  }

  if (!/^[\p{L}' -]+$/u.test(trimmedLastName)) {
    return 'Last name contains invalid characters';
  }

  return null;
};
