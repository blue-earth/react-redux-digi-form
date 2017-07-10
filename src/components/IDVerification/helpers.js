import React from 'react';
import {
  ControlLabel as BSControlLabel,
  FormControl as BSFormControl,
  FormGroup
} from 'react-bootstrap';
import { Field } from 'redux-form';
import FormFieldError from 'components/FormFieldError';
import styles from './IDVerificationForm/IDVerificationForm.scss';

export const ControlLabel = (props) => <BSControlLabel className={styles.label} {...props} />;
export const FormControl = (props) => <BSFormControl className={styles.control} {...props} />;

export const renderInput = field => (
  <FormGroup>
    {field.label && <ControlLabel>{field.label}</ControlLabel>}
    <FormControl type={field.type} placeholder={field.placeholder} {...field.input} />
    <FormFieldError for={field} />
  </FormGroup>
);

export const renderSelect = field => (
  <FormGroup>
    {field.label && <ControlLabel>{field.label}</ControlLabel>}
    <FormControl componentClass="select" {...field.input}>
      {field.children}
    </FormControl>
    <FormFieldError for={field} />
  </FormGroup>
);

export const renderCheckbox = field => (
  <FormGroup className="checkbox">
    <label>
      <Field component="input" type="checkbox" {...field.input} />
      {field.label}
    </label>
    <FormFieldError for={field} />
  </FormGroup>
);
