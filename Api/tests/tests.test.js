const request = require("supertest");
const mongoose = require("mongoose");

// const User = require("../src/models/UserModel.js");
// const Produtos = require("../src/models/ProdutosModel.js");
// const app = require("../src/index.js");
// require("dotenv").config({ path: ".env.test" })

const User = require("../src/models/UserModel.js");
const Produtos = require("../src/models/ProdutosModel.js");
const app = require("../src/index.js");
require("dotenv").config({ path: ".env.test" });

describe("Testes da API", () => {
  let produtor;
  let server;

  beforeAll(async () => {
    server = app.listen(3001);
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Criar um produtor para associar aos produtos
    produtor = await User.create({
        nome: `Produtor Teste ${Date.now()}`,
        email: `produtor${Date.now()}@email.com`,
        role: "produtor",
        telefone: "8599999",
        numeroDaCasa: "22a",
        complemento: "apto",
        cep: "60545380",
    });
  });

  afterAll(async () => {
    await User.deleteMany({ nome: "Usuário Teste"});
    await Produtos.deleteMany({ nome: "Feijão Teste" });
    
    await mongoose.connection.close();
   });

  // ================= USUÁRIOS =================
  it("deve criar um usuário com sucesso", async () => {
    const response = await request(app)
      .post("/users/criar")
      .send({
        nome: `Usuário Teste}`,
        email: `usuario${Date.now()}@email.com`,
        role: "consumidor",
        telefone: "8599999",
        numeroDaCasa: "22a",
        complemento: "apto",
        cep: "60545380",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "Usuário criado com sucesso.");
  });

  it("deve listar usuários", async () => {
    const response = await request(app).get("/users/listar");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });



  // ================= PRODUTOS =================


  it("deve criar um produto com sucesso", async () => {
    const produtor = await User.create({
        nome: "Usuário Teste",
        email: `usuario${Date.now()}@email.com`,
        role: "consumidor",
        telefone: "8599999",
        numeroDaCasa: "22a",
        complemento: "apto",
        cep: "60545380",
    });
    const response = await request(app)
      .post("/produtos/criar")
      .send({
            "IdProdutor": "68cf0c5616f159ed69c324a1",
            "nome": "feijão",
            "preco": 18.99,
            "unidade": "kg",
            "quantidade": 18
        });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
  });



  it("deve listar produtos", async () => {
    const produtoNome = `Arroz Teste ${Date.now()}`;
    const produtor = await User.create({
        nome: "Usuário Teste",
        email: `usuario${Date.now()}@email.com`,
        role: "consumidor",
        telefone: "8599999",
        numeroDaCasa: "22a",
        complemento: "apto",
        cep: "60545380",
    });

    await Produtos.create({
      nome: produtoNome,
      preco: 15,
      quantidade: 10,
      unidade: "kg",
      produtor: produtor._id,
    });

    const response = await request(app).get("/produtos/");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    const produtoCriado = response.body.find(p => p.nome === produtoNome);
    expect(produtoCriado).toBeDefined();
  });
});