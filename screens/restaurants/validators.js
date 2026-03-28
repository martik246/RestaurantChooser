export const validateName = (name) => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return 'Restaurant name is required';
  }

  if (trimmedName.length < 2) {
    return 'Name must be at least 2 characters long';
  }

  // Allow restaurant names in Latin/Cyrillic plus common punctuation and digits.
  if (!/^[\p{L}\d ,.'&-]+$/u.test(trimmedName)) {
    return 'Name contains invalid characters';
  }

  return null;
};

export const validatePhone = (phone) => {
  if (!phone.trim()) {
    return 'Phone number is required';
  }

  if (!/^\+?[\d\s\-\(\)]+$/.test(phone)) {
    return 'Invalid phone number format';
  }

  return null;
};

export const validateAddress = (address) => {
  if (!address.trim()) {
    return 'Address is required';
  }

  if (address.length < 5) {
    return 'Address too short';
  }

  return null;
};

export const validateWebsite = (website) => {
  const trimmedWebsite = website.trim();

  if (!trimmedWebsite) {
    return 'Website is required';
  }

  const websiteRegex = /^https?:\/\/(?:www\.)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:[/?#][^\s]*)?$/;

  if (!websiteRegex.test(trimmedWebsite)) {
    return 'Enter a valid website URL with http(s):// and a domain like .com or .ru';
  }

  return null;
};
