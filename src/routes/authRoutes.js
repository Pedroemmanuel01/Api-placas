const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// Rota de cadastro de usuário
router.post("/cadastro", authController.cadastrarUsuario);

// Rota de login de usuário
router.post("/login", authController.login);

module.exports = router;
