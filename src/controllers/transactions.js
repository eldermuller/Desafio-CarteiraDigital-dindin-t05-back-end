const connection = require('../connection');

const listTransactions = async (req, res) => {
    const { user } = req;
    const { filtro } = req.query;

    try {

        if (!filtro) {
            const queryTransactionList = `select 
            transacoes.id, 
            tipo, 
            transacoes.descricao, 
            valor, 
            data, 
            usuario_id, 
            categoria_id, 
            categorias.descricao as categoria_nome
            from transacoes
            left join categorias on categorias.id = transacoes.categoria_id
            where transacoes.usuario_id = $1`;
            const transactionList = await connection.query(queryTransactionList, [user.id]);

            return res.status(200).json(transactionList.rows);
        };

        const filtroQuery = filtro.map((item, index) => {
            if (index > 0) {
                return ` or transacoes.usuario_id = $1 and categorias.descricao = $${index + 2}`
            };

            return ` transacoes.usuario_id = $1 and categorias.descricao = $${index + 2}`
        });

        let queryTransactionList = `select 
        transacoes.id, 
        tipo, 
        transacoes.descricao, 
        valor, 
        data, 
        usuario_id, 
        categoria_id, 
        categorias.descricao as categoria_nome
        from transacoes
        left join categorias on categorias.id = transacoes.categoria_id
        where `;

        for (let item of filtroQuery) {
            queryTransactionList = queryTransactionList + item;
        };

        const transactionList = await connection.query(queryTransactionList, [user.id, ...filtro]);

        return res.status(200).json(transactionList.rows);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    };
};

const detailTransaction = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    try {
        const queryResponseTransaction = `select 
        transacoes.id, 
        transacoes.tipo, 
        transacoes.descricao, 
        transacoes.valor, 
        transacoes.data, 
        transacoes.usuario_id, 
        transacoes.categoria_id, 
        categorias.descricao as categoria_nome 
        from transacoes 
        left join categorias 
        on transacoes.categoria_id = categorias.id 
        where transacoes.id = $1 AND usuario_id = $2`;

        const responseTransaction = await connection.query(queryResponseTransaction, [id, user.id]);

        if (responseTransaction.rowCount === 0) {
            return res.status(404).json({ message: "Transação não encontrada" });
        };

        return res.status(200).json(responseTransaction.rows[0]);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    };
};

const registerTransaction = async (req, res) => {
    const { user } = req;
    const { description, amount, date, idcategory, type } = req.body;

    try {
        const checkCategory = await connection.query('select * from categorias where id = $1', [idcategory]);

        if (checkCategory.rowCount === 0) {
            return res.status(404).json({ message: "A categoria informada não existe." });
        };

        const queryTransactionRegister = `insert into transacoes 
        (descricao, valor, data, categoria_id, usuario_id, tipo) 
        values
        ($1, $2, $3, $4, $5, $6)`;
        const transactionRegister = await connection.query(queryTransactionRegister, [description, amount, date, idcategory, user.id, type,]);

        if (transactionRegister.rowCount === 0) {
            return res.status(400).json({ message: "Não foi possível registrar a transação." });
        };

        const allTransaction = await connection.query('select max(id) from transacoes where usuario_id = $1', [user.id]);

        const queryResponseTransaction = `select 
        transacoes.id, 
        transacoes.tipo, 
        transacoes.descricao, 
        transacoes.valor, 
        transacoes.data, 
        transacoes.usuario_id, 
        transacoes.categoria_id, 
        categorias.descricao as categoria_nome 
        from transacoes 
        left join categorias 
        on transacoes.categoria_id = categorias.id 
        where transacoes.id = $1`;

        const responseTransaction = await connection.query(queryResponseTransaction, [allTransaction.rows[0].max]);

        return res.status(201).json(responseTransaction.rows);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    };
};

const updateTransaction = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const { description, amount, date, idcategory, type } = req.body;

    try {
        const checkCategory = await connection.query('select * from categorias where id = $1', [idcategory]);

        if (checkCategory.rowCount === 0) {
            return res.status(404).json({ message: "A categoria informada não existe." });
        };

        const checkTransaction = await connection.query('select * from transacoes where id = $1', [id]);

        if (checkTransaction.rowCount === 0) {
            return res.status(404).json({ message: "A transação informada não foi encontrada." });
        };

        if (checkTransaction.rows[0].usuario_id !== user.id) {
            return res.status(403).json({ message: "O usuário informado não tem permissão para acessar a transação solicitada." });
        };

        const queryTransactionUpdate = `update transacoes set
        descricao = $1, valor = $2, data =$3, categoria_id = $4, usuario_id =$5, tipo = $6 where id = $7 and usuario_id = $8`;
        const transactionUpdate = await connection.query(queryTransactionUpdate, [description, amount, date, idcategory, user.id, type, id, user.id]);

        if (transactionUpdate.rowCount === 0) {
            return res.status(400).json({ message: "Não foi possível atualizar a transação." });
        };

        return res.status(204).json();
    } catch (error) {
        return res.status(400).json({ message: error.message });
    };
};

const deleteTransaction = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    try {
        const checkTransaction = await connection.query('select * from transacoes where id = $1', [id]);

        if (checkTransaction.rowCount === 0) {
            return res.status(404).json({ message: "A transação informada não foi encontrada." });
        };

        if (checkTransaction.rows[0].usuario_id !== user.id) {
            return res.status(403).json({ message: "O usuário informado não tem permissão para acessar a transação solicitada." });
        };

        const queryTransactionDelete = 'delete from transacoes where id = $1';
        const transactionDelete = await connection.query(queryTransactionDelete, [id]);

        if (transactionDelete.rowCount === 0) {
            return res.status(400).json({ message: "Não foi possível deletar a transação solictada" });
        };

        return res.status(204).json({});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    };
};

const transactionStatement = async (req, res) => {
    const { user } = req;

    try {
        const queryStatementTransaction = 'select sum(valor), transacoes.tipo from transacoes where usuario_id = $1 group by transacoes.tipo';
        const statementTransaction = await connection.query(queryStatementTransaction, [user.id]);

        const returnObject = {
            entrada: 0,
            saida: 0
        }

        const rows = statementTransaction.rows

        rows.forEach(statement => returnObject[statement.tipo] = statement.sum);

        return res.status(200).json(returnObject);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    };
};

module.exports = {
    listTransactions,
    detailTransaction,
    registerTransaction,
    updateTransaction,
    deleteTransaction,
    transactionStatement
};