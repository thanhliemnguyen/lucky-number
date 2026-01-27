const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lucky-number';
let db = null;

async function connectDB() {
  if (db) return db;
  
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    db = client.db();
    console.log('✅ Connected to MongoDB');
    return db;
  } catch (error) {
    console.log('❌ MongoDB not available, using memory storage');
    return null;
  }
}

async function getStats() {
  const database = await connectDB();
  if (!database) {
    return { luckyNumberRequests: 0, babyNameRequests: 0, history: [] };
  }
  
  const stats = await database.collection('stats').findOne({ _id: 'main' });
  return stats || { luckyNumberRequests: 0, babyNameRequests: 0, history: [] };
}

async function saveStats(stats) {
  const database = await connectDB();
  if (!database) return;
  
  await database.collection('stats').updateOne(
    { _id: 'main' },
    { $set: stats },
    { upsert: true }
  );
}

module.exports = { connectDB, getStats, saveStats };
