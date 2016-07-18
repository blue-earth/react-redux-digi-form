import _ from 'lodash';
export const formatUrl = (url) => _.replace(url, /\/\//g, '/');

export const dashboardPath = 'dashboard';

export const submissionsPath = 'sessions';
export const sharingPath = 'sharing';
export const alertsPath = 'alerts';
export const analyticsPath = 'analytics';
export const formsPath = 'forms';
export const documentsPath = 'documents';
export const certificationPath = 'certification';
export const usersPath = 'users';
export const settingsPath = 'settings';

export const dashboardUrl = (relativePath) =>
  formatUrl(`/${dashboardPath}/${relativePath}`);

export const submissionsUrl = (relativePath) =>
  formatUrl(`/${dashboardPath}/${submissionsPath}/${relativePath}`);

export const alertsUrl = (relativePath) =>
  formatUrl(`/${dashboardPath}/${alertsPath}/${relativePath}`);

export const sharingUrl = (relativePath) =>
  formatUrl(`/${dashboardPath}/${sharingPath}/${relativePath}`);

export const analyticsUrl = (relativePath) =>
  formatUrl(`/${dashboardPath}/${analyticsPath}/${relativePath}`);

export const formsUrl = (relativePath) =>
  formatUrl(`/${dashboardPath}/${formsPath}/${relativePath}`);

export const documentsUrl = (relativePath) =>
  formatUrl(`/${dashboardPath}/${documentsPath}/${relativePath}`);

export const certificationUrl = (relativePath) =>
  formatUrl(`/${dashboardPath}/${certificationPath}/${relativePath}`);

export const usersUrl = (relativePath) =>
  formatUrl(`/${dashboardPath}/${usersPath}/${relativePath}`);

export const settingsUrl = (relativePath) =>
  formatUrl(`/${dashboardPath}/${settingsPath}/${relativePath}`);
