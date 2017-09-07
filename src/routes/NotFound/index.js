/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */
import NotFoundPage from './components/NotFoundPage';
export default (store) => ({
  path: '*',
  component: NotFoundPage
});
