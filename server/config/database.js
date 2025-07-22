import mongoose from 'mongoose';
import User from '../models/User.model.js';
import Opportunity from '../models/Opportunity.model.js';
import Application from '../models/Application.model.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/volunteer-app', {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      retryWrites: true,
      w: 'majority'
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes without validation - skip validation for existing data
    try {
      // Use createIndexes() which doesn't validate existing documents
      await Promise.all([
        User.createIndexes(),
        Opportunity.createIndexes(),
        Application.createIndexes()
      ]);
      
      console.log('Database indexes ensured');
    } catch (error) {
      console.warn('Warning: Some database indexes could not be created:', error.message);
      // Continue anyway - indexes will be created when needed
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Please make sure MongoDB is running on your system.');
    console.log('You can start MongoDB by running: mongod --dbpath "C:\\data\\db"');
    console.log('Or install MongoDB as a service and start it.');
    
    // Don't exit immediately, give user a chance to start MongoDB
    console.log('Retrying connection in 5 seconds...');
    setTimeout(() => {
      connectDB();
    }, 5000);
  }
};

export default connectDB; 