const express = require("express");
const routes = require("./routes/index");
const { connectDB } = require("./config/db");
require("dotenv").config();

const app = express();

app.use(express.json());

// Conectar ao MongoDB
const uri = process.env.MONGO_URI;
connectDB(uri);

// Usar as rotas definidas
app.use(routes);

// Inicializar o servidor apenas se não for o ambiente de teste
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;
