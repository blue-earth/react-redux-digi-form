import _ from 'lodash';
import getCsrfToken from './csrf';

export const assignDefaults = request => {
  if (!request) {
    request = {};
  }
  const headers = request.method === 'DELETE' ? request.headers : Object.assign({}, {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }, request.headers);

  var body = null;
  if (_.includes(['POST', 'PUT'], request.method)) {
    headers['X-CSRFToken'] = getCsrfToken();
    if (request.body && !(request.body instanceof FormData)) {
      body = JSON.stringify(request.body);
    } else {
      body = request.body;
    }
  }

  const other = {
    method: 'GET',
    redirect: 'follow',
    // Change credentials to include in order to including cookie in the requests
    credentials: 'include'    // todo: Investigate the impacts on this change

  };

  return _.merge(
    other,
    request,
    { headers },
    { body }
  );
};
