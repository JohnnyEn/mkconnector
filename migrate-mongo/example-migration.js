export const up = async (db, client) => {
  await db.collection('accounts').insertOne({
    name: 'String',
    config: {
      facebookEnabled: false, // TODO: This will be active soon, now leave false Boolean
      twitterEnabled: true, // Boolean
    },
    misskey: {
      instanceUrl: 'Misskey Instance URL String',
      instanceSecretKey: 'Misskey Instance Secret String',
    },
    twitter: {
      apiKey: 'Twitter API Key String',
      apiKeySecret: 'Twitter API Key Secret String',
      accessToken: 'Twitter API Access Token String',
      accessTokenSecret: 'Twitter API Access Token Secret String',
      clientId: 'Twitter Client ID String',
      clientSecret: 'Twitter Client Secret String',
      apiBearerToken:
        'Twitter Client API Bearer Token String',
    },
    facebook: {}, // TODO: Leave this empty for now
  });
};

export const down = async (db, client) => {
  // TODO write the statements to rollback your migration (if possible)
  // Example:
  // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
};
