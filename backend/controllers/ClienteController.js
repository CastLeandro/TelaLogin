const Cliente = require('../models/clienteModel');
const fs = require('fs').promises;
const path = require('path');

class ClienteController {
    static async listarTodos(req, res) {
        try {
            const clientes = await Cliente.findAll({
                attributes: ['id', 'nome', 'telefone', 'endereco', 'latitude', 'longitude', 'foto_caminho', 'data_cadastro']
            });
            return res.status(200).json(clientes);
        } catch (error) {
            console.error('Erro ao listar clientes:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async criar(req, res) {
        try {
            const { nome, telefone, endereco, latitude, longitude } = req.body;
            const id_usuario = req.userId;

            if (!nome || !endereco) {
                if (req.file) {
                    await fs.unlink(path.resolve(req.file.path));
                }
                return res.status(400).json({ error: 'Nome e endereço são obrigatórios' });
            }

            const foto_caminho = req.file.path.replace(/\\/g, '/');
            const novoCliente = await Cliente.create({
                nome,
                telefone,
                endereco,
                latitude: latitude || null,
                longitude: longitude || null,
                foto_caminho,
                id_usuario
            });

            return res.status(201).json({
                ...novoCliente.toJSON(),
                message: 'Cliente criado com sucesso'
            });

        } catch (error) {
            if (req.file) {
                await fs.unlink(path.resolve(req.file.path)).catch(console.error);
            }
            console.error('Erro ao criar cliente:', error);
            return res.status(500).json({ error: 'Erro ao criar cliente' });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, telefone, endereco, latitude, longitude } = req.body;

            const cliente = await Cliente.findByPk(id);

            if (!cliente) {
                if (req.file) {
                    await fs.unlink(path.resolve(req.file.path)).catch(console.error);
                }
                return res.status(404).json({ error: 'Cliente não encontrado' });
            }

            let foto_caminho = cliente.foto_caminho;
            if (req.file) {
                if (cliente.foto_caminho) {
                    await fs.unlink(path.resolve(cliente.foto_caminho)).catch(console.error);
                }
                foto_caminho = req.file.path.replace(/\\/g, '/');
            }

            const clienteAtualizado = await cliente.update({
                nome: nome || cliente.nome,
                telefone: telefone || cliente.telefone,
                endereco: endereco || cliente.endereco,
                latitude: latitude !== undefined ? latitude : cliente.latitude,
                longitude: longitude !== undefined ? longitude : cliente.longitude,
                foto_caminho
            });

            return res.status(200).json({
                ...clienteAtualizado.toJSON(),
                message: 'Cliente atualizado com sucesso'
            });

        } catch (error) {
            if (req.file) {
                await fs.unlink(path.resolve(req.file.path)).catch(console.error);
            }
            console.error('Erro ao atualizar cliente:', error);
            return res.status(500).json({ error: 'Erro ao atualizar cliente' });
        }
    }

    static async deletar(req, res) {
        try {
            const { id } = req.params;
            const cliente = await Cliente.findByPk(id);

            if (!cliente) {
                return res.status(404).json({ error: 'Cliente não encontrado' });
            }

            if (cliente.foto_caminho) {
                await fs.unlink(path.resolve(cliente.foto_caminho)).catch(console.error);
            }

            await cliente.destroy();

            return res.status(200).json({ 
                message: 'Cliente removido com sucesso',
                id
            });

        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            return res.status(500).json({ error: 'Erro ao deletar cliente' });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const cliente = await Cliente.findByPk(id);

            if (!cliente) {
                return res.status(404).json({ error: 'Cliente não encontrado' });
            }

            return res.status(200).json(cliente);
        } catch (error) {
            console.error('Erro ao buscar cliente:', error);
            return res.status(500).json({ error: 'Erro ao buscar cliente' });
        }
    }
}

module.exports = ClienteController; 