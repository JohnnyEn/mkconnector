import mongoose from 'mongoose';
import tweetsSchema from '../schemas/tweet.js';
const Tweet = mongoose.model('Tweets', tweetsSchema);

const FOURTEEN_DAYS_IN_MS = 12096e5;

const checkTweet = async (note) => {
  const previousTweet = await Tweet.find({ misskeyNoteId: { $eq: note.reply?.id } })
    .catch((error) => {
      console.log(error);
      return [];
    });

  return previousTweet[0] || [];
};

const storeTweet = (note, tweet) => {
  const newTweet = new Tweet({
    misskeyNoteId: note.id,
    tweetId: tweet.data.id,
    expireAt: new Date(Date.now() + FOURTEEN_DAYS_IN_MS),
  });

  newTweet.save({});
};

export default {
  checkTweet,
  storeTweet,
};
