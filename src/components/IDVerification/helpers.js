import React, { Component, PropTypes } from 'react';
import {
  ControlLabel as BSControlLabel,
  FormControl as BSFormControl,
  FormGroup
} from 'react-bootstrap';
import FormFieldError from 'components/FormFieldError';

export const ControlLabel = (props) => <BSControlLabel className={styles.label} {...props} />;
export const FormControl = (props) => <BSFormControl className={styles.control} {...props} />;

export const renderInput = field => (
  <FormGroup>
    <ControlLabel>{field.label}</ControlLabel>
    <FormControl type={field.type} placeholder={field.placeholder} {...field.input} />
    <FormFieldError for={field} />
  </FormGroup>
);

export const renderSelect = field => (
  <FormGroup>
    <ControlLabel>{field.label}</ControlLabel>
    <FormControl componentClass="select" {...field.input}>
      {field.children}
    </FormControl>
    <FormFieldError for={field} />
  </FormGroup>
);
