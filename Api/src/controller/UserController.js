const User = require("../models/UserModel.js")
const Product = require("../models/ProdutosModel.js")
class UserController{

    async criarUser(req, res) {
        try {
            const { nome, telefone, cep, role, numeroDaCasa, complemento, email } = req.body;
            
            if(!nome || !telefone || !cep || !role || !numeroDaCasa || !complemento ){
                return res.status(400).json({ error: "Campos obrigatórios faltando." })
            }
            
            if (role !== "consumidor" && role !== "produtor") {
                return res.status(400).json({ error: "Role inválida." });
            }

            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const endereco = await response.json();

            if (endereco.erro) {
                return res.status(404).json({ error: "CEP não encontrado" });
            }

            const novoUsuario = new User({
                nome,
                role,
                telefone,
                email,
                endereco: {
                complemento:complemento,
                numero: numeroDaCasa,
                rua: endereco.logradouro,
                bairro: endereco.bairro,
                cidade: endereco.localidade,
                estado: endereco.uf,
                cep: endereco.cep
                }
            });

            await novoUsuario.save();
            return res.status(201).json({"message": "Usuário criado com sucesso."});

        } catch (error) {
            console.error("Erro ao criar usuário:", error.message);
            return res.status(500).json({ message: "Erro interno ao criar usuário" });
        }
    }

    async ListarUsuarios(req, res) {
        try {
        const usuarios = await User.find().select("_id nome email telefone role endereco");
        return res.status(200).json(usuarios);
        } catch (error) {
        console.error("Erro ao buscar usuários:", error.message);
        return res.status(500).json({ message: "Erro ao buscar usuários" });
        }
    }


    async atualizarUsuario(req, res) {
        try {
        const { id } = req.params;
        const { nome, telefone, cep, role, numeroDaCasa, complemento } = req.body;
        const data = req.body
        console.log(data);
        
        if(!nome || !telefone || !cep || !role || !numeroDaCasa || !complemento ){
            return res.status(400).json({ error: "Campos obrigatórios faltando." })
        }
        const usuarioAtualizado = await User.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!usuarioAtualizado) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        return res.status(200).json({
            "message": "Usuário atualizado com sucesso"
        });
        } catch (error) {
        console.error("Erro ao atualizar usuário:", error.message);
        return res.status(500).json({ message: "Erro interno ao atualizar usuário" , error: error});
        }
    }


    async excluirUsuario(req, res) {
        try {
        const { id } = req.params;
        const usuarioRemovido = await User.findByIdAndDelete(id);

        if (!usuarioRemovido) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        return res.status(200).json({ message: "Usuário removido com sucesso" });
        } catch (error) {
        console.error("Erro ao remover usuário:", error.message);
        return res.status(500).json({ message: "Erro interno ao remover usuário" });
        }
    }


    async BuscarUserPorId(req, res) {
        try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({ error: "Por favor, inserir um id para a consulta." });
        }
        const usuario = await User.findById(id);

        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        return res.status(200).json(usuario);
        } catch (error) {
        console.error("Erro ao buscar usuário:", error.message);
        return res.status(500).json({ message: "Erro interno ao buscar usuário" });
        }
    }






    // PRODUTORES
    async buscarProdutores(req, res){
        try {
            const produtores = await User.find({ role: "produtor" }).select("_id nome email telefone role endereco");
            res.status(200).json(produtores);
        } catch (error) {
            console.error("Erro ao listar produtores:", error.message);
            res.status(500).json({ message: "Erro interno ao buscar produtores" });
        }
    }

    async buscarProdutoresPorId(req, res){
        const {id} = req.params
        if(!id){
            return res.json({"message": "Por favor, inserir um id para a consulta."})
        }
        try {
            const produtor = await User.findById(id)
            .select("_id nome email telefone role endereco");

            if (!produtor) {
            return res.status(404).json({ message: "Produtor não encontrado" });
            }

            const produtos = await Product.find({ produtor: id }).select("_id nome preco");

            res.status(200).json({ produtor, produtos });
        } catch (error) {
            console.error("Erro ao listar produtores:", error.message);
            res.status(500).json({ message: "Erro interno ao buscar produtores" });
        }
    }




}




module.exports = UserController;