const express = require("express")
const ProdutosController = require("../controller/ProdutosController")
const ProdutosRouter = express.Router()
const produtosController = new ProdutosController()
// Rotas /produtos
ProdutosRouter.get("/",produtosController.listarProdutos)

ProdutosRouter.get("/nome",produtosController.listarPorNome)

ProdutosRouter.post("/criar",produtosController.criarProduto)

ProdutosRouter.put("/atualizar/:id",produtosController.updateProduto)

ProdutosRouter.delete("/excluir/:id",produtosController.deletarProduto)

module.exports = ProdutosRouter