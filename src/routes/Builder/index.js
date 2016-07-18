// /builder --> List all your forms
// /builder/new --> Go to a specific form, blank, unfilled
// /builder/id --> Continue a form session

import { injectReducer } from 'redux/reducers';

export default (store) => ({
  path: 'builder',
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      const reducer = require('redux/modules/formBuilder').default;
      injectReducer(store, { key: 'formBuilder', reducer });

      cb(null,
        require('./FormBuilder')
      );
    });
  },

  getIndexRoute(location, cb) {
    const reducer = require('redux/modules/formsList').default;
    injectReducer(store, { key: 'formsList', reducer });

    const FormsList = require('./FormsList').default;
    cb(null, {component: FormsList});
  }
});
