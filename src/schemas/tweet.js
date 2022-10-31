import mongoose from 'mongoose';

const { Schema } = mongoose;

const tweetSchema = new Schema({
  misskeyNoteId: String,
  tweetId: String,
  expireAt: Date,
});

export default tweetSchema;
