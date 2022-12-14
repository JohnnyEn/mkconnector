import mongoose from 'mongoose';

const { Schema } = mongoose;

const accountSchema = new Schema({
  name: String,
  config: {
    twitterEnabled: Boolean,
    twitterRepliesEnabled: Boolean,
    facebookEnabled: Boolean,
  },
  misskey: {
    instanceUrl: String,
    instanceSecretKey: String,
  },
  twitter: {
    apiKey: String,
    apiKeySecret: String,
    accessToken: String,
    accessTokenSecret: String,
    clientId: String,
    clientSecret: String,
    apiBearerToken: String,
  },
  facebook: {
    accessToken: String,
    albumId: String,
  },
});

export default accountSchema;
