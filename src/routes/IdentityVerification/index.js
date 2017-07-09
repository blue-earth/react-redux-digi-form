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
    const IdentityVerification = require('./containers/IdentityVerificationContainer').default;

    /*  Return getComponent   */
    cb(null, IdentityVerification);

    /* Webpack named bundle   */
  }, 'identityVerification');
};

const routes = [
  {
    path: ':formId/:personId',
    getComponent
  }
];

export default (store) => ({
  path: 'identity-verification',
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      const routeReducer = require('redux/modules/identityVerification').default;
      const formReducer = require('redux/modules/idVerificationForm').default;
      injectReducer(store, { key: 'identityVerification', reducer: routeReducer });
      injectReducer(store, { key: 'idVerificationForm', reducer: formReducer });
      cb(null, routes);
    });
  }
});
