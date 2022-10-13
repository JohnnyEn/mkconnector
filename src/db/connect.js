import mongoose from 'mongoose';

const databaseName = process.env.NODE_ENV === 'development' ? 'mkconnector_dev' : 'mkconnector';


const connect = async () => {
  try {
    await mongoose.connect(`mongodb://${process.env.DOCKER_MONGODB_USERNAME}:${process.env.DOCKER_MONGODB_PASSWORD}@mongo:27017`, { dbName: databaseName });
  } catch(error) {
    console.log('error: ', error);
  }
};

export default {
  connect,
};
