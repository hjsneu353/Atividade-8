const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors()); // Habilita CORS para permitir requisições do frontend
app.use(express.json()); // Parse de JSON no body das requisições

// Armazenamento em memória (simulando um banco de dados)
let users = [];
let nextId = 1;

// Middleware de logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

/**
 * Função auxiliar para validar email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Função auxiliar para validar os dados do usuário
 */
function validateUserData(data) {
    const errors = [];

    // Validação do nome
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push('Nome é obrigatório e deve ser uma string válida');
    } else if (data.name.trim().length < 3) {
        errors.push('Nome deve ter pelo menos 3 caracteres');
    }

    // Validação do email
    if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
        errors.push('Email é obrigatório');
    } else if (!isValidEmail(data.email.trim())) {
        errors.push('Email inválido');
    } else {
        // Verifica se o email já está cadastrado
        const emailExists = users.some(user => user.email.toLowerCase() === data.email.trim().toLowerCase());
        if (emailExists) {
            errors.push('Email já cadastrado');
        }
    }

    // Validação da idade
    if (data.age === undefined || data.age === null) {
        errors.push('Idade é obrigatória');
    } else if (typeof data.age !== 'number' || !Number.isInteger(data.age)) {
        errors.push('Idade deve ser um número inteiro');
    } else if (data.age < 1 || data.age > 150) {
        errors.push('Idade deve estar entre 1 e 150 anos');
    }

    return errors;
}

// ==================== ROTAS ====================

/**
 * GET /api/users
 * Retorna todos os usuários cadastrados
 */
app.get('/api/users', (req, res) => {
    try {
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao buscar usuários',
            error: error.message
        });
    }
});

/**
 * POST /api/users
 * Cadastra um novo usuário
 */
app.post('/api/users', (req, res) => {
    try {
        const { name, email, age } = req.body;

        // Validação dos dados
        const validationErrors = validateUserData({ name, email, age });
        
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Dados inválidos',
                errors: validationErrors
            });
        }

        // Cria o novo usuário
        const newUser = {
            id: nextId++,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            age: age,
            createdAt: new Date().toISOString()
        };

        // Adiciona ao array de usuários
        users.push(newUser);

        console.log(`✅ Usuário cadastrado: ${newUser.name} (ID: ${newUser.id})`);

        // Retorna sucesso
        res.status(201).json({
            success: true,
            message: 'Usuário cadastrado com sucesso!',
            data: newUser
        });

    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao cadastrar usuário',
            error: error.message
        });
    }
});

/**
 * GET /api/users/:id
 * Busca um usuário específico por ID
 */
app.get('/api/users/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }

        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

/**
 * DELETE /api/users/:id
 * Remove um usuário por ID
 */
app.delete('/api/users/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido'
            });
        }

        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        const deletedUser = users.splice(userIndex, 1)[0];

        console.log(`🗑️ Usuário removido: ${deletedUser.name} (ID: ${deletedUser.id})`);

        res.status(200).json({
            success: true,
            message: 'Usuário removido com sucesso',
            data: deletedUser
        });

    } catch (error) {
        console.error('Erro ao remover usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

/**
 * Rota de health check
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API está funcionando!',
        timestamp: new Date().toISOString(),
        totalUsers: users.length
    });
});

/**
 * Rota 404 - Rota não encontrada
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    console.log(`👥 API Users: http://localhost:${PORT}/api/users`);
    console.log('='.repeat(50));
});
