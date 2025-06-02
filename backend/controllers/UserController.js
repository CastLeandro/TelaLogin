const { where, Op } = require('sequelize');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class UserController{
    static async listarTodos(req, res) {
        const usuarios = await User.findAll({
            attributes: ['id', 'username', 'email']
        });
        return res.status(200).json(usuarios);
    }

    static async criar(req, res){
        try{
            const {username, email, senha} = req.body;

            if (!username?.trim() || !email?.trim() || !senha?.trim()) {
                return res.status(400).json({ error: 'Algum campo obrigatório não foi enviado ou está vazio' });
            }
            const newUser = await User.create({username,email,senha});
            
            // Gerar token JWT
            const token = jwt.sign(
                { id: newUser.id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email
                },
                token
            });

        }catch(error){
            console.error(error);
            res.status(500).json({error: error.message, details: error.errors});
        }
    }
    
    static async atualizar(req,res){
        const {id, campo_atualizar} = req.body;

        if(!id || !campo_atualizar){
            return res.status(404).json({mensagem: "Todos os campos devem ser enviados corretamente"});
        }

        try{
            const usuarioAntigo = await User.findOne(
            {
                where:{id: id},
                attributes:['id', 'username', 'email']
            }) 
        

        if(!usuarioAntigo){
            return res.status(404).json({mensagem: 'Usuario nao encontrado'});
        }

        const campo = campo_atualizar.campo;
        const valor = campo_atualizar.novo_valor;
        
        console.log([campo_atualizar.campo])
        await usuarioAntigo.update({
            [campo]: valor
        })

        return res.status(200).json({mensagem: 'Usuario atualizado com sucesso', usuario: usuarioAntigo});
    
        }catch(error){
            console.error('Error ao atualizar: ', error);
            return res.status(500).json({mensagem: 'Erro ao atualizar usuario'});
        }
    }

    static async deletar(req, res){
        const id = req.params.id;

        try{   
            const usuarioAntigo = await User.findByPk(id, {
                attributes:['id', 'username', 'email']
            });
            
           
            if(!usuarioAntigo){
                return res.status(404).json({mensagem: 'Usuario nao encontrado'});
            }

            await User.destroy({where: {id: id}});

            return res.status(200).json({
                mensagem: 'Usario deletado com sucesso',
                usuario: usuarioAntigo
            });

        }catch(error){
            console.error("error ao deletar usuario", error);
            return res.status(500).json({mensagem: 'Erro ao deletar usuario'});
        }
    }

    static async login(req, res) {
        try {
            const { username, senha } = req.body;

            if (!username || !senha) {
                return res.status(400).json({ error: 'Username e senha são obrigatórios' });
            }

            const user = await User.findOne({
                where: { username }
            });

            if (!user) {
                return res.status(401).json({ error: 'Usuário não encontrado' });
            }

            if (user.senha !== senha) {
                return res.status(401).json({ error: 'Senha incorreta' });
            }

            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            await user.update({ token });

            return res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
                token
            });

        } catch (error) {
            console.error('Erro no login:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

}

module.exports = UserController