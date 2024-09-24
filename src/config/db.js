const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  try {
    await mongoose.connect(uri);
    console.log("MongoDB conectado com sucesso");
  } catch (error) {
    console.error("Erro ao conectar com MongoDB:", error);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB desconectado com sucesso");
  } catch (error) {
    console.error("Erro ao desconectar MongoDB:", error);
  }
};

module.exports = { connectDB, disconnectDB };
