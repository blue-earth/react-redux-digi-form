import getCsrfToken from 'redux/utils/csrf';
import request from 'superagent';

export const verifyEmail = (email) => {
  const apiURL = `${API_URL}/verifications/api/email/verify/`;

  return new Promise(function (resolve, reject) {
    request.post(apiURL)
      .set('X-CSRFToken', getCsrfToken())
      .send({ email: email })
      .end(function(err, res) {
        if (err) {
          reject(false);
        }
        var serverResult = JSON.parse(res.text)['result'];
        if (serverResult) {
          resolve(serverResult);
        } else {
          reject(serverResult);
        }
      });
  });
};

export const aggregateVerifications = (verifications, answerValue) => {
  verifications = verifications || [];
  var results = verifications.map(function (verificationName) {
    var verificationFunction = null;
    switch (verificationName) {
      case 'EmondoEmailFieldService':
        verificationFunction = verifyEmail;
        break;
    }
    if (verificationFunction) {
      return verificationFunction(answerValue);
    }
  });
  console.log(results);
  return results;
};
