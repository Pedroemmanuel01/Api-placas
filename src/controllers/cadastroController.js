const axios = require("axios");
const FormData = require("form-data");
const Registro = require("../models/Registro");

exports.cadastrarPlaca = async (req, res) => {
  const { cidade } = req.body;
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: "Arquivo de imagem é necessário" });
  }

  try {
    const formData = new FormData();
    formData.append("file", file.buffer, "foto.png");
    formData.append("apikey", "K84408416688957"); // Chave da API OCR.space
    formData.append("language", "por"); // Define o idioma (português)

    const response = await axios.post(
      "https://api.ocr.space/parse/image",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    const placa = response.data.ParsedResults[0].ParsedText.trim();

    const novoRegistro = new Registro({ placa, cidade });
    await novoRegistro.save();

    res
      .status(201)
      .json({ message: "Registro salvo com sucesso", registro: novoRegistro });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro ao cadastrar a placa", error: err.message });
  }
};
