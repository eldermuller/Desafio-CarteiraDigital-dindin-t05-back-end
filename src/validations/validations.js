const userValidation = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "O campo nome é obrigatório" });
    };

    if (!email || email.trim() === "") {
        return res.status(400).json({ message: "O campo email é obrigatório" });
    };

    if (!password || password.trim() === "") {
        return res.status(400).json({ message: "O campo senha é obrigatório" });
    };

    next();
}

const transactionValidation = (req, res, next) => {
    const { description, amount, date, idcategory, type } = req.body;

    if (!description || description.trim() === "") {
        return res.status(400).json({ message: "O campo descrição é obrigatório." });
    };

    if (!amount) {
        return res.status(400).json({ message: "O campo valor é obrigatório." });
    };

    if (isNaN(amount) || amount < 0) {
        return res.status(400).json({ message: "O campo valor tem que ser um número válido." });
    };

    if (!date || date.trim() === "") {
        return res.status(400).json({ message: "O campo data é obrigatório." });
    };

    if (!idcategory) {
        return res.status(400).json({ message: "O campo id da categoria é obrigatório." });
    };

    if (isNaN(idcategory) || idcategory < 0) {
        return res.status(400).json({ message: "O campo id da categoria tem que ser um número válido." });
    };

    if (!type || type.trim() === "") {
        return res.status(400).json({ message: "O campo tipo é obrigatório." });
    };

    if (type !== "entrada" && type !== "saida") {
        return res.status(400).json({ message: "Defina o campo 'tipo' como 'entrada' ou 'saida'." })
    };

    next();
}

module.exports = {
    userValidation,
    transactionValidation
}