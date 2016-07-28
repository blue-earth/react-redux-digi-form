// /forms --> List all your forms
// /forms/id/<form_id> --> Go to a specific form, blank, unfilled
// /forms/id<form_id>/<form_session_id> --> Continue a form session
import { injectReducer } from 'redux/reducers';
import { submissionsPath } from 'helpers/urlHelper';
export default (store) => ({
  path: submissionsPath,
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      const reducer = require('redux/modules/submissionPreview').default;
      injectReducer(store, { key: 'submissionPreview', reducer });
      cb(null,
        require('./FormPreview')
      );
    });
  },

  getIndexRoute(location, cb) {
    const reducer = require('redux/modules/submissionsList').default;
    injectReducer(store, { key: 'submissionsList', reducer });

    const SubmissionsList = require('./SubmissionsList').default;
    cb(null, {component: SubmissionsList});
  }
});
