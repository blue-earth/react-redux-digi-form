// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout';
import Home from './Home';
import FormRoute from './Forms';
import DashboardRoute from './Dashboard';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export default (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: Home,
  childRoutes: [
    FormRoute(store),
    DashboardRoute(store)
  ]
});

// /forms --> List all your forms
// /forms/id/<form_id> --> Go to a specific form, blank, unfilled
// /forms/id<form_id>/<form_session_id> --> Continue a form session

// export const createRoutes = (store) => {
//   return (
//     <Route path="/" component={CoreLayout}>
//       <IndexRoute component={Home} />
//       <Route path="forms">
//         <IndexRoute component={FormsList} />
//         <Route path=":id" component={FormInteractive} />
//       </Route>
//     </Route>
//   )
// }

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

// export default createRoutes;
