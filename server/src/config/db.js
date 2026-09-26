import mongoose from 'mongoose';

/**
 * Connects to MongoDB database using the URI from environment variables.
 * Gracefully handles connection events and errors.
 */
export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ftrack';

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`⚡ [F-TRACK DB] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ [F-TRACK DB] Connection Error: ${error.message}`);
    console.warn('⚠️  Continuing server execution. Please ensure MongoDB is running or check MONGO_URI.');
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  [F-TRACK DB] MongoDB disconnected.');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 [F-TRACK DB] MongoDB reconnected.');
  });
};
