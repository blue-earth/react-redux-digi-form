import _ from 'lodash';
export const formatUrl = (url) => _.replace(url, /\/\//g, '/');

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

export const dashboardUrl = (relativePath) =>
  formatUrl(`/${dashboardPath}/${relativePath}`);

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
