export const validateName = (name) => {
  if (!name.trim()) {
    return "Restaurant name is required";
  }

  if (name.length < 2) {
    return "Name must be at least 2 characters long";
  }

  if (!/^[a-zA-Z0-9 ,.'&-]+$/.test(name)) {
    return "Name contains invalid characters";
  }

  return null;
};

export const validatePhone = (phone) => {
  if (!phone.trim()) {
    return "Phone number is required";
  }

  if (!/^\+?[\d\s\-\(\)]+$/.test(phone)) {
    return "Invalid phone number format";
  }

  return null;
};

export const validateAddress = (address) => {
  if (!address.trim()) {
    return "Address is required";
  }

  if (address.length < 5) {
    return "Address too short";
  }

  return null;
};

export const validateWebsite = (website) => {
  const trimmedWebsite = website.trim();

  if (!trimmedWebsite) {
    return "Website is required";
  }

  const websiteRegex = /^https?:\/\/(?:www\.)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:[/?#][^\s]*)?$/;

  if (!websiteRegex.test(trimmedWebsite)) {
    return "Enter a valid website URL with http(s):// and a domain like .com or .ru";
  }

  return null;
};
