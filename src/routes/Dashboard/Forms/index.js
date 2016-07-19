// /forms --> List all your forms
// /forms/new --> Go to a specific form, blank, unfilled
// /forms/:id/edit --> Continue a form session

import { injectReducer } from 'redux/reducers';
import { formsPath } from 'helpers/urlHelper';

export default (store) => ({
  path: formsPath,
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
