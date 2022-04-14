const connection = require('../connection');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const queryEmailConsult = 'select * from usuarios where email = $1';
        const { rowCount: numberUsers } = await connection.query(queryEmailConsult, [email]);

        if (numberUsers > 0) {
            return res.status(400).json({ message: "Já existe usuário cadastrado com o e-mail informado." });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const query = 'insert into usuarios (nome, email, senha) values ($1, $2, $3)';
        const registeredUser = await connection.query(query, [name, email, encryptedPassword]);

        if (registeredUser.rowCount === 0) {
            return res.status(400).json({ message: "Não foi possível cadastrar o usuário." });
        };

        const userRegister = await connection.query('select * from usuarios where email = $1', [email]);

        const { senha, ...user } = userRegister.rows[0];

        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const detailUser = async (req, res) => {
    const { user } = req;

    try {
        const userDatas = await connection.query('select * from usuarios where id = $1', [user.id]);

        const { senha, ...datashere } = userDatas.rows[0];

        return res.status(200).json(datashere);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    const { name, email, password } = req.body;
    const { user } = req;

    try {
        const queryVerifyEmail = 'select * from usuarios where email = $1';
        const verifyEmail = await connection.query(queryVerifyEmail, [email]);

        if (verifyEmail.rows[0] && user.id !== verifyEmail.rows[0].id) {
            return res.status(400).json({ message: "O e-mail informado já está sendo utilizado por outro usuário." });
        };

        const queryExistingUser = 'select * from usuarios where id = $1';
        const existingUser = await connection.query(queryExistingUser, [user.id]);

        if (existingUser === 0) {
            return res.status(404).json({ message: "O usuário informado não foi encontrado." });
        };

        const encryptedPassword = await bcrypt.hash(password, 10);

        const queryNewUser = 'update usuarios set nome = $1, email=$2, senha=$3 where id=$4';
        const newUser = await connection.query(queryNewUser, [name, email, encryptedPassword, user.id]);

        if (newUser.rows === 0) {
            return res.status(400).json({ message: "Não foi possível atualizar o usuário" });
        }

        return res.status(204).json({});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

module.exports = {
    registerUser,
    detailUser,
    updateUser
};