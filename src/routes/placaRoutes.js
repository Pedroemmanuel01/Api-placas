const express = require("express");
const multer = require("multer");
const cadastroController = require("../controllers/cadastroController");
const relatorioController = require("../controllers/relatorioController");
const consultaController = require("../controllers/consultaController");
const videoController = require("../controllers/videoController");
const { verificarToken } = require("../middlewares/authMiddleware");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rota de cadastro de placas (Protegida por token e com upload de arquivo)
router.post(
  "/cadastroPlaca",
  verificarToken,
  upload.single("file"),
  cadastroController.cadastrarPlaca
);

// Rota de gerar relatório de cidade (Protegida por token)
router.get(
  "/relatorio/cidade/:cidade",
  verificarToken,
  relatorioController.gerarRelatorio
);

// Rota de consulta de placa (Protegida por token)
router.get(
  "/consulta/:placa",
  verificarToken,
  consultaController.consultarPlaca
);

// Rota de envio de vídeo tutorial (Protegida por token)
router.post("/videoTutorial", verificarToken, videoController.enviarVideo);

module.exports = router;
