const express = require("express");
const multer = require("multer");
const upload = multer();

const cadastroController = require("../controllers/cadastroController");
const relatorioController = require("../controllers/relatorioController");
const consultaController = require("../controllers/consultaController");

const router = express.Router();

router.post(
  "/cadastroPlaca",
  upload.single("foto"),
  cadastroController.cadastrarPlaca
);
router.get("/relatorio/cidade/:cidade", relatorioController.gerarRelatorio);
router.get("/consulta/:placa", consultaController.consultarPlaca);

module.exports = router;
