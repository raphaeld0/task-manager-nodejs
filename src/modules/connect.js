const mongoose = require("mongoose");

const db = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://admin:admin@task-manager.7eqt2h9.mongodb.net/?retryWrites=true&w=majority&appName=task-manager`
    );
    console.log("Conexão bem-sucedida com o banco de dados");
  } catch (error) {
    console.error("Erro ao se conectar ao banco de dados:", error);
  }
};

module.exports = db;
