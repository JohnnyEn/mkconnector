import WS from 'ws';
import * as Misskey from 'misskey-js';
import twitterClient from './twitter-poster.js';

const MISSKEY_INSTANCE_URL_BASE = process.env.MISSKEY_INSTANCE_URL;
const MISSKEY_AUTH_KEY = process.env.MISSKEY_INSTANCE_SECRET_KEY;

const misskeyTimelineWatcher = async () => {
  const stream = new Misskey.Stream(MISSKEY_INSTANCE_URL_BASE, { token: MISSKEY_AUTH_KEY }, { WebSocket: WS });

  const homeChannel = stream.useChannel('homeTimeline');
  homeChannel.on('note', async (note) => {
    await twitterClient.postTweet(note);
  });
};

export default {
  misskeyTimelineWatcher,
};
