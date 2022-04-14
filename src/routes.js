const express = require('express');
const { registerUser, detailUser, updateUser } = require('./controllers/users');
const login = require('./controllers/login');
const loginVerify = require('./filters/loginVerify');
const categories = require('./controllers/category');
const { userValidation, transactionValidation } = require('./validations/validations');
const { listTransactions,
    detailTransaction,
    registerTransaction,
    updateTransaction,
    deleteTransaction,
    transactionStatement } = require('./controllers/transactions');

const routes = express();

routes.post('/usuario', userValidation, registerUser);

routes.post('/login', login);

routes.use(loginVerify);

routes.get('/usuario', detailUser);
routes.put('/usuario', userValidation, updateUser);

routes.get('/categoria', categories);

routes.get('/transacao', listTransactions);
routes.get('/transacao/extrato', transactionStatement);
routes.get('/transacao/:id', detailTransaction);
routes.post('/transacao', transactionValidation, registerTransaction);
routes.put('/transacao/:id', transactionValidation, updateTransaction);
routes.delete('/transacao/:id', deleteTransaction);

module.exports = routes;