import { exec } from 'child_process';
import { fileTypeFromFile } from 'file-type';
import wget from 'node-wget-promise';
import { TwitterApi } from 'twitter-api-v2';
import { misskeyNoteConverter } from './note-converter.js';
import TweetStore from './tweet-store.js';
import shortener from '../utils/url-shortener.js';

const TWEET_MAX_CHAR = 280;
const MAX_TWEET_MEDIA_LENGTH = 4;

let twitterV1Client = null;

const processMediaItems = async (misskeyNote) => {
  if (!misskeyNote.fileIds.length) {
    return [];
  }

  return new Promise(async (resolve, reject) => {
    let mediaIdsArray = [];

    for (let i = 0; (i < misskeyNote.files.length && i < MAX_TWEET_MEDIA_LENGTH); i++) {
      const file = misskeyNote.files[i];
      const src = file.url;
      const fileName = file.name.replace(/\s/g, '_');
      const output = `/tmp/${fileName}`;

      await wget(src, { output });

      const fileType = await fileTypeFromFile(output);

      await twitterV1Client.v1.uploadMedia(output, { mimeType: fileType.mime })
        .then((twittermediaItemId) => {
          mediaIdsArray.push(twittermediaItemId);

          exec(`rm ${output}`, (error, stdout, stderr) => {
            if (error) {
              console.log(error);
              reject();
            }
          });

          if ((i === misskeyNote.files.length - 1 || i === MAX_TWEET_MEDIA_LENGTH - 1)) {
            resolve(mediaIdsArray);
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    }
  });
};

const generateShortUrl = async (misskeyNoteId) => {
  const misskeyNoteUrl = `${process.env.MISSKEY_INSTANCE_URL}/notes/${misskeyNoteId}`;

  const shortUrl = await shortener.isGdShortener(misskeyNoteUrl);

  return shortUrl;
};

const trimNoteText = async (misskeyNoteText, misskeyNoteId) => {
  if (misskeyNoteText === null) {
    return '';
  }

  if (misskeyNoteText.length < TWEET_MAX_CHAR) {
    return misskeyNoteText;
  }

  const shortNoteUrl = await generateShortUrl(misskeyNoteId);
  const HELLIP_LENGTH = 4;
  const noteTrimLength = shortNoteUrl.length + HELLIP_LENGTH;
  const lineBreaksNumber = (misskeyNoteText.match(/\n/g)||[]).length;
  const trimmedNoteText = misskeyNoteText?.slice(0, TWEET_MAX_CHAR).slice(0, -(noteTrimLength + lineBreaksNumber + HELLIP_LENGTH));
  const shortenedNote = `${trimmedNoteText}... ${shortNoteUrl}`;

  return shortenedNote;
};

const createTwitterClient = (twitterConfig) => {
  twitterV1Client = new TwitterApi({
    appKey: twitterConfig.apiKey,
    appSecret: twitterConfig.apiKeySecret,
    accessToken: twitterConfig.accessToken,
    accessSecret: twitterConfig.accessTokenSecret,
  });
}

const postTweet = async (originalMisskeyNote, twitterConfig, config, currentUser) => {
  createTwitterClient(twitterConfig);

  if (originalMisskeyNote.text !== null && originalMisskeyNote.text.includes('#mknotwitter')) {
    return;
  }

  if (
    originalMisskeyNote.localOnly
    || typeof originalMisskeyNote.mentions !== 'undefined'
    || typeof originalMisskeyNote.renote !== 'undefined'
    || (!config.twitterRepliesEnabled && typeof originalMisskeyNote.reply !== 'undefined')) {
    return;
  }

  let misskeyNote = originalMisskeyNote;

  processMediaItems(misskeyNote)
    .then(async (twitterMediaIdsArray) => {
      const convertedNoteToTweet = misskeyNoteConverter(misskeyNote, twitterMediaIdsArray);
      const tweetText = await trimNoteText(misskeyNote.text, misskeyNote.id);

      if (config.twitterRepliesEnabled && misskeyNote.reply?.userId === currentUser) {
        const previousTweet = await TweetStore.checkTweet(misskeyNote);

        if (Object.keys(previousTweet).length) {
          const tweetResponse = await twitterV1Client.v2.reply(
            tweetText,
            previousTweet.tweetId,
            misskeyNoteConverter(misskeyNote, twitterMediaIdsArray),
          );

          TweetStore.storeTweet(misskeyNote, tweetResponse);

          return;
        }
      }

      const tweetResponse = await twitterV1Client.v2.tweet(tweetText, convertedNoteToTweet);

      if (config.twitterRepliesEnabled) {
        TweetStore.storeTweet(misskeyNote, tweetResponse);
      }
    });
};

export default {
  postTweet,
};
