# API de Gerenciamento de Usuários

API Backend desenvolvida em Node.js + Express para gerenciar usuários.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **CORS** - Habilita requisições cross-origin

## 📋 Pré-requisitos

- Node.js instalado (versão 14 ou superior)
- npm ou yarn

## 🔧 Instalação

1. **Instale as dependências:**

```bash
npm install
```

2. **Inicie o servidor:**

```bash
npm start
```

Ou para desenvolvimento com auto-reload:

```bash
npm run dev
```

A API estará rodando em `http://localhost:3000`

## 📚 Endpoints da API

### 1. Health Check
Verifica se a API está funcionando.

```http
GET /health
```

**Resposta de sucesso (200):**
```json
{
  "success": true,
  "message": "API está funcionando!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "totalUsers": 5
}
```

---

### 2. Listar Todos os Usuários

```http
GET /api/users
```

**Resposta de sucesso (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "João da Silva",
      "email": "joao@email.com",
      "age": 25,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Maria Santos",
      "email": "maria@email.com",
      "age": 30,
      "createdAt": "2024-01-15T10:35:00.000Z"
    }
  ]
}
```

---

### 3. Buscar Usuário por ID

```http
GET /api/users/:id
```

**Parâmetros:**
- `id` (number) - ID do usuário

**Resposta de sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "João da Silva",
    "email": "joao@email.com",
    "age": 25,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Resposta de erro (404):**
```json
{
  "success": false,
  "message": "Usuário não encontrado"
}
```

---

### 4. Cadastrar Novo Usuário

```http
POST /api/users
```

**Body (JSON):**
```json
{
  "name": "João da Silva",
  "email": "joao@email.com",
  "age": 25
}
```

**Validações:**
- `name`: string obrigatória, mínimo 3 caracteres
- `email`: string obrigatória, formato de email válido, único no sistema
- `age`: número inteiro obrigatório, entre 1 e 150

**Resposta de sucesso (201):**
```json
{
  "success": true,
  "message": "Usuário cadastrado com sucesso!",
  "data": {
    "id": 1,
    "name": "João da Silva",
    "email": "joao@email.com",
    "age": 25,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Resposta de erro (400):**
```json
{
  "success": false,
  "message": "Dados inválidos",
  "errors": [
    "Email já cadastrado",
    "Idade deve estar entre 1 e 150 anos"
  ]
}
```

---

### 5. Remover Usuário

```http
DELETE /api/users/:id
```

**Parâmetros:**
- `id` (number) - ID do usuário

**Resposta de sucesso (200):**
```json
{
  "success": true,
  "message": "Usuário removido com sucesso",
  "data": {
    "id": 1,
    "name": "João da Silva",
    "email": "joao@email.com",
    "age": 25,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 🧪 Testando a API

### Usando cURL

**Listar usuários:**
```bash
curl http://localhost:3000/api/users
```

**Cadastrar usuário:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João da Silva",
    "email": "joao@email.com",
    "age": 25
  }'
```

**Buscar usuário por ID:**
```bash
curl http://localhost:3000/api/users/1
```

**Remover usuário:**
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

### Usando o Frontend

1. Abra o arquivo `index.html` no navegador
2. O frontend se conectará automaticamente à API
3. Use o formulário para cadastrar usuários
4. A lista será atualizada automaticamente

## 📂 Estrutura do Projeto

```
.
├── server.js          # Servidor principal da API
├── package.json       # Dependências e scripts
└── README.md         # Documentação
```

## 🔒 Segurança e Validações

A API implementa as seguintes validações:

- ✅ Validação de formato de email
- ✅ Verificação de email duplicado
- ✅ Validação de idade (1-150 anos)
- ✅ Validação de nome (mínimo 3 caracteres)
- ✅ Sanitização de dados (trim, lowercase no email)
- ✅ Tratamento de erros
- ✅ CORS habilitado

## 💾 Armazenamento

Atualmente, os dados são armazenados em **memória**. Isso significa que:

- ⚠️ Os dados são perdidos quando o servidor é reiniciado
- ✅ Ideal para desenvolvimento e testes
- ✅ Pode ser facilmente migrado para banco de dados (MongoDB, PostgreSQL, etc.)

### Migração para Banco de Dados

Para usar um banco de dados real, você pode:

1. **MongoDB:** Adicionar `mongoose` e conectar ao MongoDB
2. **PostgreSQL:** Adicionar `pg` ou `sequelize`
3. **SQLite:** Adicionar `sqlite3` para armazenamento local persistente

## 🎯 Status Codes

- `200` - Sucesso (GET, DELETE)
- `201` - Criado com sucesso (POST)
- `400` - Dados inválidos
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

## 📝 Logs

O servidor registra todas as requisições no console:

```
[2024-01-15T10:30:00.000Z] POST /api/users
✅ Usuário cadastrado: João da Silva (ID: 1)
[2024-01-15T10:31:00.000Z] GET /api/users
```

## 🤝 Contribuindo

Sugestões e melhorias são bem-vindas!

## 📄 Licença

ISC
