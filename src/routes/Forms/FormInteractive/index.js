module.exports = {
  path: ':id',
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
     and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
       dependencies for bundling   */
      const FormInteractive = require('./containers/FormInteractiveContainer').default;
      // const reducer = require('./modules/counter').default
      /*  Add the reducer to the store on key 'counter'  */
      // injectReducer(store, { key: 'counter', reducer })

      /*  Return getComponent   */
      cb(null, FormInteractive);

      /* Webpack named bundle   */
    }, 'form_interactive')
  }
};