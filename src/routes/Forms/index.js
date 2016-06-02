// /forms --> List all your forms
// /forms/id/<form_id> --> Go to a specific form, blank, unfilled
// /forms/id<form_id>/<form_session_id> --> Continue a form session


export default (store) => ({
  path: 'forms',
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./FormInteractive')
      ])
    })
  },

  getIndexRoute(location, cb) {
    // do something async here
    const FormsList = require('./FormsList').default;
    cb(null, {component: FormsList})

  }
})
