const Registro = require("../models/Registro");

exports.consultarPlaca = async (req, res) => {
  const { placa } = req.params;

  try {
    const registro = await Registro.findOne({ placa });

    if (registro) {
      res.json({ message: "Placa encontrada", registro });
    } else {
      res.status(404).json({ message: "Placa não encontrada" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro ao consultar a placa", error: err.message });
  }
};
