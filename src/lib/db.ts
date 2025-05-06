import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/trip-explorer';

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI, {
    dbName: 'trip-explorer',
  });
}

const tripSchema = new mongoose.Schema({
  name: String,
  capital: String,
  region: String,
  flag: String,
  userEmail: String,
  notes: String,
});

export const Trip = mongoose.models.Trip || mongoose.model('Trip', tripSchema);
