const pool = require("../../db.js");
const { getBooksList } = require("./queries.js");

const getValue = async (req, res) => {

    try {
        const { value } = req.body;
        const bookStat = parseInt(value);
        const results = await pool.query(getBooksList, [req.session.userId, bookStat]);
        const books = results.rows;
        res.status(200).send({success:true,books});

    } catch (error) {
        console.error("Hata:", error);
        return res.status(500).send({ success: false, error: "Sunucu hatası" });
    }
};

module.exports = {
    getValue
};