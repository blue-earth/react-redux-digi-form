export const validateIsRequired = (value) => {
  return (typeof value !== 'undefined' && value !== '' && value !== null) 
}

export const validateIsEmail = (value) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(value)
}

export const validateMinLength = (value, length) => {
  return (typeof value !== 'undefined' && value.length >= length )
}

export const validateMaxLength = (value, length) => {
  return !(typeof value !== 'undefined' && value.length > length )
}

const validateField = (validation, value) => {
  switch (validation.type) {
    case 'isRequired':
      return validateIsRequired(value)
    case 'minLength':
      return validateMinLength(value, validation.value)
    case 'maxLength':
      return validateMaxLength(value, validation.value)
    case 'isEmail':
      return validateIsEmail(value)
  }
}

export default validateField