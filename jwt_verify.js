const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');

const { publicKey } = require('./config').keys;

const ISSUER = 'simple-sso';

const verifyJwtToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(
      token,
      publicKey,
      { issuer: ISSUER, algorithms: ['RS256'] },
      (err, decoded) => {
        if (err) return reject(err);
        return resolve(decoded);
      }
    );
  });

const decodeJwtToken = token => {
  if (token) {
    const parsedJwt = jwtDecode(token);
    return parsedJwt;
  } else {
    return null;
  }
};

const isTokenExpired = token => {
  const parsedJwt = decodeJwtToken(token);
  const currentTime = new Date().getTime();
  const expireAt = parsedJwt && parsedJwt.exp ? parsedJwt.exp * 1000 : null;

  // console.log('parsedJwt', parsedJwt);
  // console.log('currentTime', currentTime);
  // console.log('expireAt', expireAt);

  if (expireAt) {
    if (currentTime < expireAt) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
};

module.exports = Object.assign(
  {},
  { verifyJwtToken, decodeJwtToken, isTokenExpired }
);
