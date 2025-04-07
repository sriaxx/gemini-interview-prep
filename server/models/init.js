
const mongoose = require('mongoose');

// Function to create necessary collections on startup if they don't exist
const createProfiles = async () => {
  try {
    // Check if profiles collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    if (!collections.some(col => col.name === 'profiles')) {
      console.log('Creating profiles collection');
      await mongoose.connection.db.createCollection('profiles');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = { createProfiles };
