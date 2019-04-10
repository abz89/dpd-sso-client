var Resource = require('deployd/lib/resource'),
  util = require('util');

var url = require('url'),
  axios = require('axios');

var verifyJwtToken = require('./jwt_verify').verifyJwtToken;
var isTokenExpired = require('./jwt_verify').isTokenExpired;

// var ssoServer = 'http://accounts.edubox.cloud:3030';
var ssoServer = 'http://account.box';

var ssoServerJwtUrl = `${ssoServer}/simplesso/verifytoken`;
var ssoServerLoginUrl = `${ssoServer}/simplesso/login`;

function Hello(name, options) {
  Resource.apply(this, arguments);
}
util.inherits(Hello, Resource);

Hello.label = 'SSO Client';
Hello.defaultPath = '/auth';

module.exports = Hello;

Hello.prototype.clientGeneration = true;

Hello.prototype.handle = function(ctx, next) {
  if (ctx.req && ctx.req.method !== 'GET') return next();

  var ssoToken = ctx.query.ssoToken;
  var myUrl = url.parse(ctx.req.url).pathname;
  var redirectURL = `${ctx.req.protocol}://${ctx.req.headers.host}${
    ctx.req.path
  }`;

  if (ssoToken != null) {
    var response = axios.get(`${ssoServerJwtUrl}?ssoToken=${ssoToken}`, {
      headers: {
        Authorization: 'Bearer l1Q7zkOL59cRqWBkQ12ZiGVW2DBL'
      }
    });

    response.then(
      function(resp) {
        var token = resp.data.token;
        decoded = verifyJwtToken(token);

        decoded.then(
          function(data) {
            //          if (data.uid === data.globalSessionID) {

            console.log('data', data);
            console.log('isTokenExpired', isTokenExpired(data.globalSessionID));

            if (isTokenExpired(data.globalSessionID)) {
              ctx.session.remove(function() {
                // next();
                axios
                  .get(`${ssoServer}/simplesso/logout`)
                  .then(result => {
                    console.log('get ssoServer result data', result.data);
                    return ctx.res.redirect(
                      `${ssoServerLoginUrl}?serviceURL=${redirectURL}`
                    );
                  })
                  .catch(err => {
                    console.log('get ssoServer error', err);
                  });
              });
            } else {
              ctx.session.set(data).save(function(e, s) {
                ctx.res.cookies.set('sid', s.id, {
                  overwrite: true
                });
                ctx.res.setHeader('X-Session-Token', s.id);
                ctx.done(null, s);
              });
            }

            //          } else {
            /* ctx.session.remove(function () {
            return ctx.res.redirect(myUrl);
          }); */
            //            next();
            //          }
          },
          function() {
            // console.log('jwt not valid');
            next();
          }
        );
      },
      function() {
        /* ctx.session.remove(function () {
          return ctx.res.redirect(`${ssoServerLoginUrl}?serviceURL=${redirectURL}`);
        }); */
        next();
      }
    );
  } else {
    // console.log('!ctx.session.data.globalSessionID', !ctx.session.data.globalSessionID);
    console.log(
      'CHECK TOKEN EXPIRATION',
      isTokenExpired(ctx.session.data.globalSessionID)
    );

    if (
      !ctx.session.data.globalSessionID ||
      isTokenExpired(ctx.session.data.globalSessionID)
    ) {
      console.log('REDIRECTING', 'REDIRECTING');
      return ctx.res.redirect(`${ssoServerLoginUrl}?serviceURL=${redirectURL}`);
    } else {
      ctx.done(null, ctx.session.data);
    }
  }
};
