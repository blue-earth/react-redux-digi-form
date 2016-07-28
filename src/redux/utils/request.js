import _ from 'lodash';

export const assignDefaults = request => {
  if (typeof request === 'undefined') request = {};
  const headers = request.method === 'DELETE' ? request.headers || {} : _.merge({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Cookie: document.cookie
  }, request.headers || {});

  const body = _.includes(['POST', 'PUT'], request.method) && request.body
    ? JSON.stringify(request.body)
    : request.body;

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
