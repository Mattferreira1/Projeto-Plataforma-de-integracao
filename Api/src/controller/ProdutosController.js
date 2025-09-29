const { Resend } = require("resend");
require('dotenv').config()

const resend = new Resend(process.env.RESEND_API_KEY);

const Product = require("../models/ProdutosModel");
const User = require("../models/UserModel");
class ProdutosController{

    async criarProduto(req, res){
      try {
        const { nome, descricao, preco, quantidade, unidade, IdProdutor } = req.body;
    
        if (!nome || !preco || !quantidade || !unidade || !IdProdutor) {
          return res.status(400).json({ message: "Campos obrigatórios ausentes" });
        }
        const produtor = await User.findById(IdProdutor);

        if (!produtor) {
          return res.status(404).json({ message: "Produtor não encontrado" });
        }

        if (produtor.role !== "produtor") {
          return res.status(403).json({ message: "Apenas produtores podem cadastrar produtos" });
        }

    
        const novoProduto = new Product({
          nome,
          descricao,
          preco,
          quantidade,
          unidade,
          produtor: IdProdutor
        });
    
        await novoProduto.save();
    
        res.status(201).json({message: "Produto criado com sucesso."});
    
      } catch (error) {
        console.error("Erro ao criar produto:", error.message);
        res.status(500).json({ message: "Erro interno ao criar produto" });
      }
    }
    
    //Listar por nome
    async listarPorNome(req, res){
      const { nome } = req.body;
      
      if(!nome){
        return res.status(500).json({
          message: "Por favor passar o nome do produto."
        })
      }
      
      try {
        const produtos = await Product.find({
          nome: { $regex: nome, $options: "i" }
        })
        .collation({ locale: "pt", strength: 1 })
        .populate("produtor", "nome telefone endereco");
    
        return res.json(produtos);
      } catch (error) {
        console.error("Erro ao buscar produtos por nome:", error.message);
        return res.status(500).json({ error: "Algo deu errado :(" });
      }
    }

    
    // Deletar produto
    async deletarProduto(req, res){
      try {
        const { id } = req.params;
    
        const produtoDeletado = await Product.findOneAndDelete({ _id: id});

    
        res.status(200).json({ message: "Produto removido com sucesso" });
      } catch (error) {
        console.error("Erro ao deletar produto:", error.message);
        res.status(500).json({ message: "Erro interno ao deletar produto" });
      }
    };

   // Listar todos os produtos
    async listarProdutos(req, res) {
      try {
        const produtos = await Product.find()
          .populate("produtor", "nome telefone endereco");

        res.status(200).json(produtos);
      } catch (error) {
        console.error("Erro ao listar produtos:", error.message);
        res.status(500).json({ message: "Erro interno ao listar produtos" });
      }
    }

    // Atualizar produto
    async updateProduto(req, res) {
      try {
        const { id } = req.params;
        const { nome, descricao, preco, quantidade, unidade, produtor } = req.body;

        const produto = await Product.findOne({ _id: id, produtor });

        if (!produto) {
          return res.status(404).json({ message: "Produto não encontrado ou você não tem permissão" });
        }

        if (nome) produto.nome = nome;
        if (descricao) produto.descricao = descricao;
        if (preco) produto.preco = preco;
        if (quantidade) produto.quantidade = quantidade;
        if (unidade) produto.unidade = unidade;

        await produto.save();

        res.status(200).json({ message: "Produto atualizado com sucesso", produto });
      } catch (error) {
        console.error("Erro ao atualizar produto:", error.message);
        res.status(500).json({ message: "Erro interno ao atualizar produto" });
      }
    }
    async gerarPedido(req, res){
      try {
        const { produtoId, quantidade, clienteId } = req.body;

        if (!produtoId || !quantidade || !clienteId) {
          return res.status(400).json({ message: "Dados incompletos." });
        }

        const produto = await Product.findById(produtoId).populate("produtor");
        if (!produto) {
          return res.status(404).json({ message: "Produto não encontrado." });
        }

        const cliente = await User.findById(clienteId);
        if (!cliente) {
          return res.status(404).json({ message: "Cliente não encontrado." });
        }

        const produtor = produto.produtor;
        if (!produtor || !produtor.email) {
          return res.status(400).json({ message: "Produtor inválido." });
        }

        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: produtor.email,
          subject: "Novo pedido recebido!",
          html: `
            <p>Olá, ${produtor.nome}!</p>
            <p>Você recebeu um novo pedido.</p>

            <p><strong>Cliente</strong></p>
            <p>${cliente.nome} (${cliente.email}) </p>
            <p> Endereço: ${cliente.endereco.rua}, ${cliente.endereco.numero} ${cliente.endereco.complemento? cliente.endereco.complemento: "" }, ${cliente.endereco.bairro}, ${cliente.endereco.cidade}, ${cliente.endereco.estado} - ${cliente.endereco.cep} </p>
            <p><strong>Produtos</strong></p>

            <p>=================================</p>
            <p><strong>Produto:</strong> ${produto.nome}</p>
            <p><strong>Quantidade:</strong> ${quantidade}</p>
            <p>=================================</p>
          `,
        });

        return res.status(200).json({
          message: "Pedido realizado e e-mail enviado ao produtor!",
        });
      } catch (error) {
        console.error("Erro ao processar pedido:", error);
        return res.status(500).json({ message: "Erro ao processar pedido." });
      }
    }
}

module.exports = ProdutosController