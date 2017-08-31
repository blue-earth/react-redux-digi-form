import buildSchema from 'redux-form-schema';

const schemaGeneral = {
  'title': {
    label: 'Form name',
    required: true
  },
  'slug': {
    label: 'Hosted form URL',
    required: true
  },
  'formConfig.redirect': {
    label: 'Redirect URL'
  },
  'formConfig.customise.footer': {
    label: 'Footer'
  },
  'formConfig.customise.emondoBranding': {
    label: 'emondo branding',
    type: 'boolean'
  }
};
export const formSchemaGeneral = buildSchema(schemaGeneral);

const schemaNotifications = {
  'formConfig.externalNotifications.recipients[].data': {
    label: 'Send email notifications to'
  },
  'formConfig.externalNotifications.recipients[].type': {
    label: 'Recipient type'
  },
  'formConfig.externalNotifications.sender': {
    label: 'Send email notifications from',
    type: 'email'
  },
  'formConfig.externalNotifications.signature': {
    label: 'Signature'
  },
  'formConfig.externalNotifications.disclaimer': {
    label: 'Disclaimer'
  }
};
export const formSchemaNotifications = buildSchema(schemaNotifications);
