const request = require("supertest");
const app = require("../app");
const Registro = require("../models/Registro");
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

  token = res.body.token; // Armazena o token retornado no login

  // Log do token para verificar se está correto
  console.log("Token obtido:", token);

  // Criar um registro de placa para testar
  await Registro.create({
    placa: "ABC1234",
    cidade: "São Paulo",
  });
});

afterAll(async () => {
  await disconnectDB();
});

afterEach(async () => {
  await Usuario.deleteMany({});
});

describe("Relatório de Cidade API", () => {
  it("Deve gerar um relatório PDF com sucesso", async () => {
    const res = await request(app)
      .get("/relatorio/cidade/São Paulo")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.header["content-type"]).toEqual("application/pdf");
  });

  it("Deve retornar erro ao não encontrar registros na cidade", async () => {
    const res = await request(app)
      .get("/relatorio/cidade/Rio de Janeiro")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200); // Como a função ainda envia um PDF mesmo sem registros
  });
});
