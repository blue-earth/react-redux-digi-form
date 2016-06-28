const getComponent = (nextState, cb) => {
  /*  Webpack - use 'require.ensure' to create a split point
   and embed an async module loader (jsonp) when bundling   */
  require.ensure([], (require) => {
    /*  Webpack - use require callback to define
     dependencies for bundling   */
    const FormBuilder = require('./containers/FormBuilderContainer').default;

    /*  Return getComponent   */
    cb(null, FormBuilder);

    /* Webpack named bundle   */
  }, 'formBuilder');
};

module.exports = [
  {
    path: ':id/edit',
    getComponent
  },
  {
    path: 'new',
    getComponent
  }
];
