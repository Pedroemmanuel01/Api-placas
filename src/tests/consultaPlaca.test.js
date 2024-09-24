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

  token = res.body.token;

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

describe("Consulta de Placas API", () => {
  it("Deve retornar uma placa existente", async () => {
    const res = await request(app)
      .get("/consulta/ABC1234")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Placa encontrada");
    expect(res.body.registro).toHaveProperty("placa", "ABC1234");
  });

  it("Deve retornar erro ao não encontrar a placa", async () => {
    const res = await request(app)
      .get("/consulta/XYZ9999")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message", "Placa não encontrada");
  });
});
