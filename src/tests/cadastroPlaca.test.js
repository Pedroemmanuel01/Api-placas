const path = require("path");
const fs = require("fs");
const request = require("supertest");
const app = require("../app");
const { connectDB, disconnectDB } = require("../config/db");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");

let token;

beforeAll(async () => {
  await connectDB();

  // Criar um usuário para teste
  const senhaCriptografada = await bcrypt.hash("senha123", 10);
  await Usuario.create({
    email: "teste@teste.com",
    senha: senhaCriptografada,
  });

  // Fazer login para obter o token
  const res = await request(app)
    .post("/login")
    .send({ email: "teste@teste.com", senha: "senha123" });

  token = res.body.token;

  console.log("Token obtido:", token);
});

afterAll(async () => {
  await disconnectDB();
});

afterEach(async () => {
  await Usuario.deleteMany({});
});

describe("Cadastro de Placas API", () => {
  const filePath = path.join(__dirname, "../../uploads", "foto.png");

  if (!fs.existsSync(filePath)) {
    console.error("Arquivo de imagem não encontrado:", filePath);
  }

  it("Deve cadastrar uma placa com sucesso", async () => {
    const res = await request(app)
      .post("/cadastroPlaca")
      .set("Authorization", `Bearer ${token}`)
      .field("cidade", "São Paulo")
      .attach("file", filePath);

    console.log("Resposta do cadastro com sucesso:", res.body);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "Registro salvo com sucesso");
  });

  it("Deve retornar erro ao não enviar arquivo de imagem", async () => {
    const res = await request(app)
      .post("/cadastroPlaca")
      .set("Authorization", `Bearer ${token}`)
      .send({ cidade: "São Paulo" });

    console.log("Resposta sem arquivo de imagem:", res.body);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "message",
      "Arquivo de imagem é necessário"
    );
  });
});
