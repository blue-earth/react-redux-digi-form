const getComponent = (nextState, cb) => {
  /*  Webpack - use 'require.ensure' to create a split point
   and embed an async module loader (jsonp) when bundling   */
  require.ensure([], (require) => {
    /*  Webpack - use require callback to define
     dependencies for bundling   */
    const FormInteractive = require('./containers/FormInteractiveContainer').default;

    /*  Return getComponent   */
    cb(null, FormInteractive);

    /* Webpack named bundle   */
  }, 'formInteractive');
};

module.exports = [
  {
    path: ':id',
    getComponent
  },
  {
    path: ':id/:sessionId',
    getComponent
  },
  {
    path: ':id/:sessionId/:status',
    getComponent
  }
];
