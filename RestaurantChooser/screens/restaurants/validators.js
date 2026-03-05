export const validateName = (name) => {
  if (!name.trim()) {
    return "Restaurant name is required";
  }
  
  if (name.length < 2) {
    return "Name must be at least 2 characters long";
  }
  
  if (!/^a-zA-Z0-9 ,'-+$/.test(name)) {
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
  if (!website.trim()) {
    return null;
  }
  
  if (!/^https?:\/\/.+/.test(website)) {
    return "Invalid website URL";
  }
  
  return null;
};