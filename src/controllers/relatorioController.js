const PDFDocument = require("pdfkit");
const Registro = require("../models/Registro");

exports.gerarRelatorio = async (req, res) => {
  const { cidade } = req.params;

  try {
    const registros = await Registro.find({ cidade });

    const doc = new PDFDocument();
    let filename = `relatorio_${cidade}.pdf`;

    res.setHeader("Content-disposition", "attachment; filename=" + filename);
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);
    doc.text(`Relatório de registros para a cidade: ${cidade}\n\n`);

    registros.forEach((registro) => {
      doc.text(`Placa: ${registro.placa} | Data e Hora: ${registro.dataHora}`);
    });

    doc.end();
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro ao gerar o relatório", error: err.message });
  }
};
