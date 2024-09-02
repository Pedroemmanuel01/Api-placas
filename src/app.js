const express = require("express");
const connectDB = require("./config/db");
const routes = require("./routes");

const app = express();
connectDB();

app.use(express.json());
app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
