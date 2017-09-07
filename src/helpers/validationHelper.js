export const validateIsRequired = (value) => {
  var result = !(typeof value === 'undefined' || value === '' || value === null ||
    (value.constructor === Array && value.length === 0));
  if (!result) {
    return 'This field is required';
  }
  return null;
};

export const validateIsEmail = (value) => {
  // from http://emailregex.com/
  // modified using Python version of regex
  // Addition 1: Rejected domain that has only one characeter
  var re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.([a-zA-Z0-9-.]{2,8})+$/i;
  var result = re.test(value);
  if (!result) {
    return 'Please enter a valid email';
  }
  return null;
};

export const validateMinLength = (value, length) => {
  value = value.trim();
  var result = (typeof value !== 'undefined' && value.length >= length);
  if (!result) {
    return `Minimum of ${length} charaters are required`;
  }
  return null;
};

export const validateMaxLength = (value, length) => {
  value = value.trim();
  var result = !(typeof value !== 'undefined' && value.length > length);
  if (!result) {
    return `Maximum of ${length} charaters are required`;
  }
  return null;
};

export const validateMinValue = (value, minValue) => {
  var result = value >= minValue;
  if (!result) {
    return `Value must not be less than ${minValue}`;
  }
  return null;
};

export const validateMaxValue = (value, maxValue) => {
  var result = value <= maxValue;
  if (!result) {
    return `Value must not be greater than ${maxValue}`;
  }
  return null;
};

export const valueIsValid = (value, validations) => {
  var errors = [];
  if (validations) {
    for (var i = 0; i < validations.length; i++) {
      var result = validateField(validations[i], value);
      if (result) {
        errors.push(result);
      }
    }
  }
  return errors;
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
