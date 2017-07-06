import React, { PropTypes } from 'react';
import _ from 'lodash';

const FormFieldError = ({ for: field }) => {
  if (!field) return false;
  const { meta: { error, touched }, afterTouch = true } = field;
  const show = error && (touched || !afterTouch);
  const output = show && _.map(error, (item, index) =>
    <div key={index}>{item}</div>
  );
  return (
    <div className="text-danger">{output}</div>
  );
};

FormFieldError.propTypes = {
  afterTouch: PropTypes.bool,
  for: PropTypes.object.isRequired
};

export default FormFieldError;
