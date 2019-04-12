# SSO Client (Example Implementation) Module for Deployd

## Description

This module is just intended for my learning purpose. Currenty I wrote this code as adapting code from [this article](https://codeburst.io/building-a-simple-single-sign-on-sso-server-and-solution-from-scratch-in-node-js-ea6ee5fdf340).

## Installation

```shell
$ npm install --save git+https://git@github.com/abz89/dpd-sso-client.git
```

## Configuration

- Open [Deployd Dashboard](http://localhost:2403/dashboard)
- Add new "SSO Client" resource
- Insert endpoint URL i.e ("/auth")
- Currently for configuring SSO Server URL could be done by passing "ssoServer" [config](https://npmjs.com/package/config) or SSO_SERVER environment
- Change/replace JWT Key in (./config/keys/jwtPublic.key)
- WIP

## Future Improvement
- Dynamic SSO Server URL, JWT key via Deployd Resource Config
- More detailed documentation of course ;0
- And LAST BUT NOT LEAST , FEEL FREE TO CONTRIBUTE


