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
// console.log(buildSchema(schema));
// export default buildSchema(schema);
const formSchema = buildSchema(schema);
export default formSchema;
