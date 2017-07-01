import buildSchema from 'redux-form-schema';

const schema = {
  'email': {
    label: 'Email',
    required: true,
    type: 'email'
  },
  'password': {
    label: 'Password',
    required: true
  }
};

const formSchema = buildSchema(schema);
export default formSchema;
