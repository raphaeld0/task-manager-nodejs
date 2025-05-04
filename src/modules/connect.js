const mongoose = require("mongoose");

const db = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@task-manager.7eqt2h9.mongodb.net/?retryWrites=true&w=majority&appName=task-manager`
    );
    console.log("db connect...");
  } catch (error) {
    console.error("db error", error);
  }
};

module.exports = db;
