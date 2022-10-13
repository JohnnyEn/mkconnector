import WS from 'ws';
import * as Misskey from 'misskey-js';
import mongoose from 'mongoose';
import twitterClient from './twitter-poster.js';
import facebookClient from './facebook-poster.js';
import accountSchema from '../schemas/account.js';

const Account = mongoose.model('Account', accountSchema);

const getCurrentUser = async (misskeyConfig) => {
  const client = new Misskey.api.APIClient({
    origin: misskeyConfig.instanceUrl,
    credential: misskeyConfig.instanceSecretKey,
  });

  const currentUser = await client.request('i');
  return currentUser.id;
};

const misskeyTimelineWatcher = async (account) => {
  const currentUser = await getCurrentUser(account.misskey);

  const stream = new Misskey.Stream(account.misskey.instanceUrl, { token: account.misskey.instanceSecretKey }, { WebSocket: WS });

  const homeChannel = stream.useChannel('homeTimeline');
  homeChannel.on('note', async (note) => {
    if (note.userId === currentUser) {
      if (account.config.twitterEnabled) {
        await twitterClient.postTweet(note, account.twitter);
      }

      if (account.config.facebookEnabled) {
        await facebookClient.post(note, account.facebook);
      }
    }
  });
};

const startWatching = () => {
  if (process.env.MKCONNECTOR_USE_DOCKER_DATABASE) {
    Account.find({})
      .then((accounts) => {
        accounts.forEach((account) => {
          if (account.config.twitterEnabled) {
            misskeyTimelineWatcher(account);
          }
        });
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  } else {
    const account = {
      config: {
        twitterEnabled: process.env.MKCONNECTOR_TWITTER_ENABLED,
        facebookEnabled: process.env.MKCONNECTOR_FACEBOOK_ENABLED,
      },
      misskey: {
        instanceUrl: process.env.MISSKEY_INSTANCE_URL,
        instanceSecretKey: process.env.MISSKEY_INSTANCE_SECRET_KEY,
      },
      twitter: {
        apiKey: process.env.TWITTER_API_KEY,
        apiKeySecret: process.env.TWITTER_API_KEY_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
        clientId: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET,
        apiBearerToken: process.env.TWITTER_API_BEARER_TOKEN,
      },
      facebook: {
        accessToken: process.env.FACEBOOK_API_ACCESS_TOKEN,
        albumId: process.evn.FACEBOOK_ALBUM_ID,
      },
    };

    misskeyTimelineWatcher(account);
  }
}

export default {
  startWatching,
};
