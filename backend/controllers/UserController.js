const User = require('../models/userModel');

class UserController{
    static async listar(req, res) {
        const usuarios = await User.findAll();
        return res.status(200).json(usuarios);
    }

    static async criar(req, res){
        try{
            const {username, email, senha} = req.body;

            if (!username?.trim() || !email?.trim() || !senha?.trim()) {
                return res.status(400).json({ error: 'Algum campo obrigatório não foi enviado ou está vazio' });
            }
            const newUser = await User.create({username,email,senha});
            res.status(201).json(newUser);

        }catch(error){
            console.error(error);
            res.status(500).json({error: error.messagee, details: error.erros});
        }

    }
    

}

module.exports = UserController