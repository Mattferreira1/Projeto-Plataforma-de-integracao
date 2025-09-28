# Plataforma de Conexão entre Produtores do Mercado São Sebastião e Consumidores

Esta API tem como objetivo gerenciar usuários, produtos e o envio de pedidos por e-mail.
Os usuários são classificados como consumidores ou produtores. Durante o cadastro, os endereços são preenchidos automaticamente por meio da integração com a API do ViaCEP, reduzindo erros de digitação. Além disso, a API Resend é utilizada para realizar o envio dos pedidos por e-mail.

O propósito principal é facilitar a visualização dos produtos disponíveis e tornar o processo de compra mais ágil e eficiente.

Integrantes da equipe:

```json
    DAYANE DO NASCIMENTO PAULINO - 2326944 - Testes
    ISMAEL GUSTAVO DA SILVA - 2326204 - Desenvolvimento
    PAULO JONATHAN RIBEIRO LUZ - 2323859 - Documentação
    STAYNER RODRIGUES DE LIMA - 2326190 - Documentação
    MATHEUS FERREIRA SILVA ROCHA - 2326202 - Desenvolvimento
```




---
# Avisos

Todos os payloads necessários ja estarão disponíveis nas coleções do postman.

Observações: 

- É necessário fazer 1 requisição qualquer antes dos testes devido ao mongoDB desativar o banco de dados após muito tempo inativo. 


## Instalação

1 -Digitar no git bash

```json
git clone https://github.com/Mattferreira1/Projeto-Plataforma-de-integracao.git
```

2 - Entre na pasta gerada e depois na pasta api

3 - Abra o cmd na pasta api e digite:

```json
npm install
```

4 - Inicie a api com:

```json
npm run dev
```

Para fechar a aplicação, pressione:

Ctrl + C

E depois confirme.

## Testes

1- Abrir o cmd na pasta api e digitar:

```json
npm run test
```

Para sair dos testes, pressione:

Ctrl + C

E depois confirme.


##  Rotas de Usuários


<details>
<summary>
Listar usuários
</summary>

GET /users/listar


**Descrição:** Retorna a lista de usuários cadastrados.  

**Resposta (200):**
```json
[
  {
    "_id": "12345",
    "nome": "João da Silva",
    "email": "joao@email.com",
    "telefone": "999999999",
    "role": "consumidor",
    "endereco": {
      "rua": "Rua Exemplo",
      "bairro": "Centro",
      "cidade": "Fortaleza",
      "estado": "CE",
      "cep": "60000-000",
      "numero": "123",
      "complemento": "Apto 101"
    }
  }
]
```

</details>


<details>
<summary>
Buscar usuário por ID
</summary>

GET /users/buscar/:id

**Descrição:** Retorna o usuário referente ao ID

**Resposta (200):**
```json
{
  "_id": "12345",
  "nome": "Maria Souza",
  "email": "maria@email.com",
  "telefone": "888888888",
  "role": "produtor",
  "endereco": {
    "rua": "Avenida Brasil",
    "bairro": "Centro",
    "cidade": "Rio de Janeiro",
    "estado": "RJ",
    "cep": "20000-000",
    "numero": "456",
    "complemento": "Casa"
  }
}
```

**Possíveis erros:**

404 → Usuário não encontrado

400 → ID não informado
</details>



<details>
<summary>
Criar usuário
</summary>

POST /users/criar


**Descrição:** Cria um novo usuário no sistema. O endereço é preenchido automaticamente via ViaCEP.

Payload:

```json
{
  "nome": "Carlos Pereira",
  "telefone": "777777777",
  "cep": "01001000",
  "role": "consumidor",
  "numeroDaCasa": "100",
  "complemento": "Bloco B",
  "email": "carlos@email.com"
}
```

**Resposta (201):**
```json
{ 
    "message": "Usuário criado com sucesso."
}
```

**Erros possíveis:**

400 → Campos obrigatórios faltando

400 → Role inválida (deve ser consumidor ou produtor)

404 → CEP não encontrado

500 → Erro interno ao criar usuário

</details>





<details>
<summary>
Atualizar usuário
</summary>


PUT /users/atualizar/:id

**Descrição:** Atualiza os dados de um usuário existente.

Payload:
```json
{
  "nome": "Carlos Almeida",
  "telefone": "777777777",
  "cep": "01001000",
  "role": "produtor",
  "numeroDaCasa": "120",
  "complemento": "Bloco C",
  "email": "carlos.almeida@email.com"
}
```

Resposta (200):

```json
{
    "message": "Usuário atualizado com sucesso"
}
```

**Erros possíveis:**

400 → Campos obrigatórios faltando

404 → Usuário não encontrado

500 → Erro interno ao atualizar usuário
</details>






<details>
<summary>
Excluir usuário
</summary>
DELETE /users/apagar/:id


**Descrição:** Remove um usuário do sistema.


```json
{ "message": "Usuário removido com sucesso" }
```

**Erros possíveis:**

404 → Usuário não encontrado

500 → Erro interno ao remover usuário

</details>


## Rotas para produtores

<details>
<summary>
Listar todos os produtores
</summary>
Endpoint:

get /users/produtores/listar

**Descrição:**
Retorna todos os usuários cadastrados com o papel (role) de produtor.

**Resposta (200):**
```json
[
  {
    "_id": "66f18f31e01a9c1d2c5a5678",
    "nome": "Maria Souza",
    "email": "maria@email.com",
    "telefone": "888888888",
    "role": "produtor",
    "endereco": {
      "rua": "Avenida Brasil",
      "bairro": "Centro",
      "cidade": "Rio de Janeiro",
      "estado": "RJ",
      "cep": "20000-000",
      "numero": "456",
      "complemento": "Casa"
    }
  }
]
```

**Erros possíveis:**

500 → Erro interno ao listar produtores

</details>



<details>
<summary>
Buscar Produtor por ID
</summary>

Endpoint:

GET /produtores/:id

**Descrição:**

Busca um produtor específico pelo ID e retorna também a lista de seus produtos.

**Parâmetros de rota:**

id → ID do produtor (obrigatório)

Resposta (200):
```json
{
  "produtor": {
        "endereco": {
            "numero": "22a",
            "complemento": "apto",
            "rua": "Rua Araçá",
            "bairro": "Bonsucesso",
            "cidade": "Fortaleza",
            "estado": "CE",
            "cep": "60545-380"
        },
        "_id": "68cf0c5616f159ed69c324a1",
        "nome": "teste",
        "telefone": "8599999",
        "email": "tes2t@gmail.com",
        "role": "produtor"
    },
  "produtos": [
    {
      "_id": "77g29h41f02b0d2e3d6b9876",
      "nome": "Feijão Carioca",
      "preco": 10.5
    },
    {
      "_id": "77g29h41f02b0d2e3d6b6543",
      "nome": "Arroz Branco",
      "preco": 8.0
    }
  ]
}
```
**Erros possíveis:**

400 → ID não informado

404 → Produtor não encontrado

500 → Erro interno ao buscar produtor

</details>



##  Rotas de produtos

<details>
<summary>
Listar todos os produtos
</summary>

GET /produtos/

**Descrição:**

Lista todos os produtos cadastrados.

Resposta (200):

```json
[
  {
    "_id": "66e73c8d123",
    "nome": "Feijão",
    "descricao": "Feijão carioca",
    "preco": 10.5,
    "quantidade": 20,
    "unidade": "kg",
    "produtor": {
      "endereco": {
          "numero": "22a",
          "complemento": "apto",
          "rua": "Rua a",
          "bairro": "aldeota",
          "cidade": "Fortaleza",
          "estado": "CE",
          "cep": "60502-32"
      },
      "_id": "68c840bc574ab30ea1270c8b",
      "nome": "teste",
      "telefone": "989898"
  }
  }
]
```
**Erros possíveis:**

500 → Erro interno ao listar produtos

</details>


<details>

<summary>
Listar produto por nome
</summary>
GET /produtos/nome

**Descrição:**
Busca produtos pelo nome (ignora maiúsculas/minúsculas e acentos).

### Importante: o nome do produto precisa ser igual ao cadastrado, incluindo acentuação.

Payload:

```json
{
  "nome": "feijão"
}
```


Resposta (200):

```json
[
  {
    "_id": "66e73c8d123",
    "nome": "Feijão",
    "descricao": "Feijão carioca",
    "preco": 10.5,
    "quantidade": 20,
    "unidade": "kg",
    "produtor": {
      "_id": "66e73a1b456",
      "nome": "João Silva",
      "telefone": "1199999999",
      "endereco": "Rua A, 123"
    }
  }
]
```

**Erros possíveis:**

500 → Erro interno

500 → Nome do produto não informado

</details>


<details>
<summary>
Criar Produto
</summary>

POST /produtos/criar

Cria um novo produto (somente se o usuário for um produtor).

**Body esperado:**

```json
{
  "nome": "Arroz",
  "preco": 25,
  "quantidade": 50,
  "unidade": "kg",
  "IdProdutor": "66e73a1b456"
}

```


**Respostas possíveis:**

201 → Produto criado com sucesso.

400 → Campos obrigatórios ausentes.

404 → Produtor não encontrado.

403 → Usuário não é produtor.

500 → Erro interno.
</details>


<details>
<summary>
Atualizar produto
</summary>

PUT /produtos/atualizar/:id


**descrição:**

Atualiza um produto (somente se o produtor for o dono do produto).

**Parâmetro de rota: id (ID do produto).**

Obrigatório enviar o id do produtor no body.

Payload:

```json
{
  "nome": "Arroz Integral",
  "preco": 30,
  "quantidade": 40,
  "unidade": "kg",
  "produtor": "68cf0c5616f159ed69c324a1"
}

```

**Respostas possíveis:**

200 → Produto atualizado com sucesso.

404 → Produto não encontrado ou sem permissão.

500 → Erro interno.

</details>



<details>
<summary>
Deletar produto
</summary>

DELETE /produtos/excluir/:id

Remove um produto pelo ID.

Parâmetro de rota: id (ID do produto).

Resposta (200):
```json
{ 
  "message": "Produto removido com sucesso"
}
```


**Erros possíveis:**

404 → Produto não encontrado.

500 → Erro interno.

</details>


<!-- <details>
<summary>
Gerar um novo pedido
</summary>

</details> -->

<details>
<summary>
Gerar um novo pedido
</summary>

POST produtos/pedidos

Descrição: Processa os dados de um novo pedido, envia um e-mail de notificação para o produtor com os detalhes da compra e do cliente, e retorna uma mensagem de confirmação.

Payload:
```json
{
    "produtoId":"68d578c99fecdd3792fcdf35",
    "quantidade":13,
    "clienteId": "68cf0c4916f159ed69c3249d"
}
```

Resposta (200 - OK):
```json
{
  "message": "Pedido realizado e e-mail enviado ao produtor!"
}
```

Possíveis erros:

500 → Erro interno no servidor ao tentar processar o pedido ou enviar o e-mail.

```json
{
  "message": "Erro ao processar pedido."
}
```

</details>
