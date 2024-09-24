const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ error: "Token não fornecido" });
  }

  // Extrair o token do cabeçalho Authorization
  const token = authHeader.split(" ")[1]; // Obtém o token após "Bearer"

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Erro ao verificar token:", err);
      return res.status(401).json({ error: "Token inválido" });
    }

    req.userId = decoded.id;
    next();
  });
};

module.exports = { verificarToken };
