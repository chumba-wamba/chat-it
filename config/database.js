const mongoose = require("mongoose");

connectDB = async () => {
  try {
    connection = await mongoose.connect(process.env.DATABASE_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(
      `successfully connected to database at host -> ${connection.connection.host}`
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
