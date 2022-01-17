/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */

if (process.env.BROWSER) {
  throw new Error(
    'Do not import `config.js` from inside the client-side code.',
  );
}

const log4jsConfig = {
  pm2: true,
  //pm2InstanceVar: 'INSTANCE_ID',
  appenders: {
    access: {
      type: 'dateFile',
      filename: process.env.LOG_FILE_ACCESS || 'log/access.log',
      pattern: '-yyyy-MM-dd',
      category: 'http',
    },
    app: {
      type: 'file',
      filename: process.env.LOG_FILE_APP || 'log/app.log',
      maxLogSize: 10485760,
      numBackups: 3,
    },
    errorFile: {
      type: 'file',
      filename: process.env.LOG_FILE_ERROR || 'log/errors.log',
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile',
    },
  },
  categories: {
    default: { appenders: ['app', 'errors'], level: 'DEBUG' },
    http: { appenders: ['access'], level: 'DEBUG' },
  },
};

module.exports = {
  // Node.js app
  port: process.env.PORT || 3000,

  maxAge: 120,

  log4jsConfig,

  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl: process.env.API_CLIENT_URL || '',
    // API URL to be used in the server-side code
    serverUrl:
      process.env.API_SERVER_URL ||
      `http://localhost:${process.env.PORT || 3000}`,
  },

  // Database
  databaseUrl: process.env.DATABASE_URL || 'sqlite:database.sqlite',

  // Web analytics
  analytics: {
    // https://analytics.google.com/
    googleTrackingId: 'UA-198011-4', // UA-XXXXX-X
  },

  preloadFontFamily: {
    default: [
      'proxima_nova_regular_1',
      'proximanova-semibold',
      'proxima_nova_extrabold_1',
    ],
    montserrat: [
      'montserrat-v14-latin-500',
      'montserrat-v14-latin-600',
      'montserrat-v14-latin-700',
      'montserrat-v14-latin-800',
      'montserrat-v14-latin-regular',
    ],
  },

  // Authentication
  auth: {
    jwt: { secret: process.env.JWT_SECRET || 'React Starter Kit' },

    // https://developers.facebook.com/
    facebook: {
      id: process.env.FACEBOOK_APP_ID || '186244551745631',
      secret:
        process.env.FACEBOOK_APP_SECRET || 'a970ae3240ab4b9b8aae0f9f0661c6fc',
    },

    // https://cloud.google.com/console/project
    google: {
      id:
        process.env.GOOGLE_CLIENT_ID ||
        '251410730550-ahcg0ou5mgfhl8hlui1urru7jn5s12km.apps.googleusercontent.com',
      secret: process.env.GOOGLE_CLIENT_SECRET || 'Y8yR9yZAhm9jQ8FKAL8QIEcd',
    },

    // https://apps.twitter.com/
    twitter: {
      key: process.env.TWITTER_CONSUMER_KEY || 'Ie20AZvLJI2lQD5Dsgxgjauns',
      secret:
        process.env.TWITTER_CONSUMER_SECRET ||
        'KTZ6cxoKnEakQCeSpZlaUCJWGAlTEBJj0y2EMkUBujA7zWSvaQ',
    },
  },
};
