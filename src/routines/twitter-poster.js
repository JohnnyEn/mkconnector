import { exec } from 'child_process';
import { fileTypeFromFile } from 'file-type';
import wget from 'node-wget-promise';
import { TwitterApi } from 'twitter-api-v2';
import { misskeyNoteConverter } from './note-converter.js';
import shortener from '../utils/url-shortener.js';

const TWEET_MAX_CHAR = 280;

const twitterV1Client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_KEY_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.
  TWITTER_ACCESS_TOKEN_SECRET,
});

const processMediaItems = async (misskeyNote) => {
  if (!misskeyNote.fileIds.length) {
    return [];
  }

  return new Promise(async (resolve, reject) => {
    const MAX_TWEET_MEDIA_LENGTH = 4;
    let mediaIdsArray = [];

    for (let i = 0; i < MAX_TWEET_MEDIA_LENGTH; i++) {
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

          if (i === misskeyNote.files.length - 1 || i === MAX_TWEET_MEDIA_LENGTH) {
            resolve(mediaIdsArray);
          }
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
  const trimmedNoteText = misskeyNoteText?.slice(0, TWEET_MAX_CHAR).slice(0, -noteTrimLength);

  return `${trimmedNoteText}... ${shortNoteUrl}`;
};

const postTweet = async (originalMisskeyNote) => {
  if (originalMisskeyNote.text !== null && originalMisskeyNote.text.includes('#mknotwitter')) {
    return;
  }

  if (originalMisskeyNote.localOnly || typeof originalMisskeyNote.mentions !== 'undefined' || typeof originalMisskeyNote.reply !== 'undefined') {
    return;
  }

  let misskeyNote = originalMisskeyNote;

  if (typeof misskeyNote.renote !== 'undefined') {
    misskeyNote = originalMisskeyNote.renote;
  }

  processMediaItems(misskeyNote)
    .then(async (twitterMediaIdsArray) => {
      const convertedNoteToTweet = misskeyNoteConverter(misskeyNote, twitterMediaIdsArray);
      const tweetText = await trimNoteText(misskeyNote.text, misskeyNote.id);

      await twitterV1Client.v1.tweet(tweetText, convertedNoteToTweet);
    });
};

export default {
  postTweet,
};
