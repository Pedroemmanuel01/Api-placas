const request = require("supertest");
const app = require("../app");
const { connectDB, disconnectDB } = require("../config/db");
const Usuario = require("../models/Usuario");

let server;

beforeAll(async () => {
  await connectDB();
  server = app.listen(process.env.TEST_PORT || 3001);
});

afterAll(async () => {
  await disconnectDB();
});

afterEach(async () => {
  await Usuario.deleteMany({});
});

describe("Cadastro de Usuário API", () => {
  it("Deve cadastrar um novo usuário com sucesso", async () => {
    const res = await request(server).post("/cadastro").send({
      email: "novo@teste.com",
      senha: "senha123",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty(
      "message",
      "Usuário cadastrado com sucesso"
    );
  });

  it("Deve retornar erro ao tentar cadastrar com um email já existente", async () => {
    // Primeiro, cadastramos o usuário
    await Usuario.create({
      email: "existente@teste.com",
      senha: "senha123",
    });

    // Agora, tentamos cadastrar com o mesmo email
    const res = await request(server).post("/cadastro").send({
      email: "existente@teste.com",
      senha: "senha123",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Usuário já cadastrado");
  });

  it("Deve retornar erro ao tentar cadastrar sem email ou senha", async () => {
    const res = await request(server).post("/cadastro").send({
      email: "",
      senha: "",
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty("message", "Erro ao cadastrar usuário");
  });
});
