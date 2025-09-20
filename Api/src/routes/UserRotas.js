const express = require("express");
const UserController = require("../controller/UserController");
const UserRoutes = express.Router();
const userController = new UserController() 



// ROTA /users 
UserRoutes.get("/listar", userController.ListarUsuarios );

UserRoutes.get("/buscar/:id", userController.BuscarUserPorId );

UserRoutes.post("/criar", userController.criarUser );

UserRoutes.put("/atualizar/:id", userController.atualizarUsuario );

UserRoutes.delete("/apagar/:id", userController.excluirUsuario );


// ROTA /users/produtores
UserRoutes.get("/produtores/listar", userController.buscarProdutores );

UserRoutes.get("/produtores/buscar/:id", userController.buscarProdutoresPorId );





module.exports = UserRoutes;
