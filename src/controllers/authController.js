const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

exports.cadastrarUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: "Usuário já cadastrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    const novoUsuario = new Usuario({
      email,
      senha: senhaCriptografada,
    });

    await novoUsuario.save();
    res.status(201).json({ message: "Usuário cadastrado com sucesso" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro ao cadastrar usuário", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: "Credenciais incorretas" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ message: "Credenciais incorretas" });
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro ao fazer login", error: err.message });
  }
};
