import buildSchema from 'redux-form-schema';

const idVerificationFormProperties = {
  'type': {
    label: 'Identity document type',
    required: true
  },
  'passport_number': {
    label: 'Passport no.(incl. letters)',
    required: true
  },
  'date_of_birth': {
    label: 'Date of birth',
    required: true
  },
  'first_name': {
    label: 'First name',
    required: true
  },
  'last_name': {
    label: 'Last name',
    required: true
  },
  'expiry_date': {
    label: 'Expiry date',
    required: true
  },
  'place_of_birth': {
    label: 'Place of birth',
    required: true
  },
  'email': {
    label: 'Email',
    required: true
  },
  'gender': {
    label: 'Gender',
    required: true
  }
};

export const identityConstants = {
  DVSPASSPORT: 0,
  DVSDRIVERLICENSE: 1,
  DVSMEDICARECARD: 2,
  AUSTRALIAN_ELECTORAL_ROLL: 3,
  AUSTRALIAN_CREDIT_AGENCY: 4,
  MANUAL_FILE_UPLOAD: 5
};

export const genderList = [
  {
    label: 'Male',
    value: 'M'
  },
  {
    label: 'Female',
    value: 'F'
  }
];

export const identityDocumentTypesList = [
  {
    label: 'Australian passport',
    value: identityConstants.DVSPASSPORT
  },
  {
    label: 'Australian driver\'s license',
    value: identityConstants.DVSDRIVERLICENSE
  },
  {
    label: 'Medicare Card',
    value: identityConstants.DVSMEDICARECARD
  },
  {
    label: 'Australian Electoral Roll',
    value: identityConstants.AUSTRALIAN_ELECTORAL_ROLL
  },
  {
    label: 'Australian Credit Agency',
    value: identityConstants.AUSTRALIAN_CREDIT_AGENCY
  }
];

export const passportFields = [
  'type', 'passport_number', 'date_of_birth', 'first_name', 'last_name', 'email'
];

export default buildSchema(idVerificationFormProperties);
