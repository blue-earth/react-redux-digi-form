// /forms --> List all your forms
// /forms/id/<form_id> --> Go to a specific form, blank, unfilled
// /forms/id<form_id>/<form_session_id> --> Continue a form session

import { injectReducer } from 'redux/reducers';

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

const routes = [
  {
    path: ':formIdSlug',
    getComponent
  },
  {
    path: ':formIdSlug/:sessionId',
    getComponent
  },
  {
    path: ':formIdSlug/:sessionId/:status', // status: `completed` | `review`
    getComponent
  }
];

export default (store) => ({
  path: 'forms',
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      const reducer = require('redux/modules/formInteractive').default;
      injectReducer(store, { key: 'formInteractive', reducer });

      cb(null, routes);
    });
  }
});
