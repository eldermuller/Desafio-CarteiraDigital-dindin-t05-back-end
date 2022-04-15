const connection = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = require('../secret');

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: "O E-mail é obrigatório." });

    };

    if (!password) {
        return res.status(400).json({ message: "A senha é obrigatória." });
    };

    try {
        const queryVerifyEmail = 'select * from usuarios where email = $1';
        const { rows, rowCount } = await connection.query(queryVerifyEmail, [email]);

        if (rowCount === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        };

        const user = rows[0];


        const verifiedPassword = await bcrypt.compare(password, user.senha);

        if (!verifiedPassword) {
            return res.status(400).json({ message: 'Usuário e/ou senha inválido(s).' });
        };

        const token = jwt.sign({ id: user.id }, secret, { expiresIn: '8d' });

        const { senha, ...userDatas } = user;

        return res.status(200).json({
            usuario: userDatas,
            token: token
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    };
};

module.exports = login;