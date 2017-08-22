export const validateIsRequired = (value) => {
  return !(typeof value === 'undefined' || value === '' || value === null ||
    (value.constructor === Array && value.length === 0));
};

export const validateIsEmail = (value) => {
  var re = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i; // eslint-disable-line
  return re.test(value);
};

export const validateMinLength = (value, length) => {
  return (typeof value !== 'undefined' && value.length >= length);
};

export const validateMaxLength = (value, length) => {
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
