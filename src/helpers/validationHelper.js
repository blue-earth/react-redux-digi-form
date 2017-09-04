export const validateIsRequired = (value) => {
  return !(typeof value === 'undefined' || value === '' || value === null ||
    (value.constructor === Array && value.length === 0));
};

export const validateIsEmail = (value) => {
  // from http://emailregex.com/
  // modified using Python version of regex
  // Addition 1: Rejected domain that has only one characeter
  var re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.([a-zA-Z0-9-.]{2,8})+$/i;
  return re.test(value);
};

export const validateMinLength = (value, length) => {
  value = value.trim();
  return (typeof value !== 'undefined' && value.length >= length);
};

export const validateMaxLength = (value, length) => {
  value = value.trim();
  return !(typeof value !== 'undefined' && value.length > length);
};

export const validateMinValue = (value, minValue) => {
  return value >= minValue;
};

export const validateMaxValue = (value, maxValue) => {
  return value <= maxValue;
};

export const valueIsValid = (value, validations) => {
  var isValid = true;
  if (validations) {
    for (var i = 0; i < validations.length; i++) {
      isValid = validateField(validations[i], value);
      if (!isValid) break;
    }
  }
  return isValid;
};

const validateField = (validation, value) => {
  switch (validation.type) {
    case 'isRequired':
      return validateIsRequired(value);
    case 'minLength':
      return validateMinLength(value, validation.value);
    case 'maxLength':
      return validateMaxLength(value, validation.value);
    case 'minimum':
      return validateMinValue(value, validation.value);
    case 'maximum':
      return validateMaxValue(value, validation.value);
    case 'isEmail':
      return validateIsEmail(value);
  }
};

export default validateField;
