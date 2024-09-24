const request = require("supertest");
const app = require("../app");
const Usuario = require("../models/Usuario");
const { connectDB, disconnectDB } = require("../config/db");
const bcrypt = require("bcryptjs");

beforeAll(async () => {
  await connectDB();

  // Criar um usuário válido para testar o login
  const senhaCriptografada = await bcrypt.hash("senha123", 10);
  await Usuario.create({
    email: "teste@teste.com",
    senha: senhaCriptografada,
  });
});

afterAll(async () => {
  await disconnectDB();
});

afterEach(async () => {
  await Usuario.deleteMany({});
});

describe("Login API", () => {
  it("Deve fazer login com sucesso e retornar um token", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "teste@teste.com", senha: "senha123" });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("Deve retornar erro com credenciais incorretas", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "teste@teste.com", senha: "senhaErrada" });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Credenciais incorretas");
  });

  it("Deve retornar erro se o email não for encontrado", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "naoexiste@teste.com", senha: "senha123" });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Credenciais incorretas");
  });
});
