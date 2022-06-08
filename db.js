const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(process.env.NODE_ENV == 'development' ? 'mongodb://localhost:27017/blog': process.env.MONGO_URI);
  console.log('Database connected!');
}
main()

module.exports = main;
