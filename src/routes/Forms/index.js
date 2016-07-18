// /forms --> List all your forms
// /forms/id/<form_id> --> Go to a specific form, blank, unfilled
// /forms/id<form_id>/<form_session_id> --> Continue a form session
import { injectReducer } from 'redux/reducers';

export default (store) => ({
  path: 'forms',
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      const reducer = require('redux/modules/formInteractive').default;
      injectReducer(store, { key: 'formInteractive', reducer });

      cb(null,
        require('./FormInteractive')
      );
    });
  }
});
