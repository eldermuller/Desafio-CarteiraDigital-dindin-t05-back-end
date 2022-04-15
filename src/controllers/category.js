const connection = require('../connection');

const categoryList = async (req, res) => {

    const { user } = req;

    try {
        const categories = await connection.query(`select  * from categorias`);

        return res.status(200).json(categories.rows);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    };
};

module.exports = categoryList;