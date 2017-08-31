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
  'formConfig.notifications.recipient': {
    label: 'Send email notifications to'
  },
  'formConfig.notifications.sender': {
    label: 'Send email notifications from'
  },
  'formConfig.notifications.signature': {
    label: 'Signature'
  }
};
export const formSchemaNotifications = buildSchema(schemaNotifications);
