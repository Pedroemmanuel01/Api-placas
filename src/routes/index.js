const express = require("express");
const authRoutes = require("./authRoutes");
const placaRoutes = require("./placaRoutes");
const router = express.Router();

// Rotas de autenticação
router.use("/", authRoutes);

// Rotas de cadastro de placa, relatórios e consultas
router.use("/", placaRoutes);

module.exports = router;
