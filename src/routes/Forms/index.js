import { injectReducer } from '../../store/reducers';
// /forms --> List all your forms
// /forms/id/<form_id> --> Go to a specific form, blank, unfilled
// /forms/id<form_id>/<form_session_id> --> Continue a form session


export default (store) => ({
  path: 'forms',
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./routes/form_interactive')
      ])
    })
  },

  getIndexRoute(location, cb) {
    // do something async here
    const FormList = require('./containers/FormInteractiveContainer').default;
    cb(null, {component: FormList})

  },

  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const FormList = require('./containers/FormInteractiveContainer').default;


      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'forms_list' });

      /*  Return getComponent   */
      cb(null, FormList);

    /* Webpack named bundle   */
    }, 'forms_list')
  }
})
