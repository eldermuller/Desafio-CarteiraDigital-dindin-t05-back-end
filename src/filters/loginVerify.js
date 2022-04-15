const connection = require('../connection');
const secret = require('../secret');
const jwt = require('jsonwebtoken');

const loginVerify = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    };

    try {
        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token, secret);

        const query = 'select * from usuarios where id = $1';
        const { rows, rowCount } = await connection.query(query, [id]);

        if (rowCount === 0) {
            return res.status(404).json('O usuário não foi encontrado.');
        };

        const { senha, ...user } = rows[0];

        req.user = user;

        next();
    } catch (error) {
        return res.status(400).json({ message: error.message });
    };

};

module.exports = loginVerify;