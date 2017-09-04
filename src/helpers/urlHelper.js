import _ from 'lodash';
export const formatUrl = (url) => _.replace(url, /\/\//g, '/').replace(/\/$/, '');

export const rootPath = '/';

/*
login
*/
export const loginPath = 'login';

export const loginUrl = (relativePath='') =>
  formatUrl(`${rootPath}/${loginPath}/${relativePath}`);

/*
dashboard
*/
export const dashboardPath = 'dashboard';

export const submissionsPath = 'submissions';
export const sharingPath = 'sharing';
export const alertsPath = 'alerts';
export const analyticsPath = 'analytics';
export const formsPath = 'forms';
export const documentsPath = 'documents';
export const certificationPath = 'certification';
export const usersPath = 'users';
export const settingsPath = 'settings';
export const signupPath = 'sign-up';

export const dashboardUrl = (relativePath) =>
  formatUrl(`${rootPath}/${dashboardPath}/${relativePath}`);

export const submissionsUrl = (relativePath) =>
  formatUrl(dashboardUrl(`/${submissionsPath}/${relativePath}`));

export const alertsUrl = (relativePath) =>
  formatUrl(dashboardUrl(`/${alertsPath}/${relativePath}`));

export const sharingUrl = (relativePath) =>
  formatUrl(dashboardUrl(`/${sharingPath}/${relativePath}`));

export const analyticsUrl = (relativePath) =>
  formatUrl(dashboardUrl(`/${analyticsPath}/${relativePath}`));

export const formsUrl = (relativePath) =>
  formatUrl(dashboardUrl(`/${formsPath}/${relativePath}`));

export const documentsUrl = (relativePath) =>
  formatUrl(dashboardUrl(`/${documentsPath}/${relativePath}`));

export const certificationUrl = (relativePath) =>
  formatUrl(dashboardUrl(`/${certificationPath}/${relativePath}`));

export const usersUrl = (relativePath) =>
  formatUrl(dashboardUrl(`/${usersPath}/${relativePath}`));

export const settingsUrl = (relativePath) =>
  formatUrl(dashboardUrl(`/${settingsPath}/${relativePath}`));

export const signupUrl = (relativePath) =>
  formatUrl(`${rootPath}/${signupPath}/${relativePath}`);

export const editFormUrl = (formId) =>
  formsUrl(`${formId}/edit`);

export const subHeaderType = (path) => {
// TODO: is there a better way to figure out where we are?
  if (!path) {
    return '';
  }
  var pathArray = path.split('/');
  pathArray = pathArray.filter((n) => (n !== ''));
  // determine if we are in form builder or somewhere else
  var type = '';
  if (pathArray[1] === 'forms' && pathArray[3] === 'edit') {
    type = 'formBuilder';
  }
  if (pathArray[1] === 'forms' && pathArray[2] === 'new') {
    type = 'formBuilder';
  }
  return type;
};
