const pool = require("../../db.js");
const { getBooksList, getUser, getUserByEmail } = require("./queries.js");
const crypto = require('crypto-js');

const getValue = async (req, res, next) => {
    if (req.body.value == 5) {
        next();
    } else {
        try {
            const { value } = req.body;
            const bookStat = parseInt(value);
            const results = await pool.query(getBooksList, [req.session.userId, bookStat]);
            const books = results.rows;
            res.status(200).send({ success: true, books, value });
        } catch (error) {
            console.error("Hata:", error);
            return res.status(500).send({ success: false, error: "Sunucu hatası" });
        }
    }
};

const updateStudent = (req, res) => {
    const id = parseInt(req.params.id);
    const { username, surname, email, password } = req.body;
    const hashedPassword = crypto.SHA256(password).toString();

    pool.query("SELECT FROM users WHERE id = $1 AND password = $2", [id, hashedPassword], (error, results) => {
        const noStudent = !results.rows.length;

        if (noStudent) {
            return res.send("Şifreniz yanlış lütfen tekrar deneyiniz.");
        } else {
            pool.query("UPDATE users SET username = $1, surname = $2, email = $3 WHERE id = $4",
                [username, surname, email, id], (error, results) => {
                    if (error) throw error;
                    return res.redirect('/chackout');
                });
        }
    });
};

const getUserInfo = async (req, res) => {
    try {
        const userid = req.session.userId;

        pool.query(getUser, [userid], (error, results) => {
            if (error) throw error;

            if (results) {
                const { username, surname, email } = results.rows[0];
                return res.render('chackout', { name: username, surname: surname, email: email, username: req.session.username, userId: req.session.userId });
            } else {
                return res.render('chackout', { name: "", surname: "", email: "", username: "", userId: "" });
            }
        });
    } catch (error) {
        console.log("Fonksiyonda bir hata gerçekleşti");
        return res.render('404');
    }
};


const renderForgotPasswordPage = (req, res) => {
    res.render('forgot-password', { username: req.session.username });
};  

const resetPassword = async (req, res) => {
    const { username, surname, email, newPassword } = req.body;
    if (newPassword.length < 6) {
        return res.status(400).send('Şifre en az 6 karakter olmalıdır.');
    }

    try {
        // Kullanıcının bilgilerini kontrol et
        const result = await pool.query(getUserByEmail, [email]);
        const user = result.rows[0];

        if (user && user.username === username && user.surname === surname) {
            // Şifreyi hashle
            const hashedPassword = crypto.SHA256(newPassword).toString();

            // Şifreyi güncelle
            await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);
            // Başarılı mesajı ile yanıt gönder
            // res.send('Şifre başarıyla sıfırlandı.');
            return res.redirect('/');

        } else {
            res.status(400).send('Girilen bilgilerde hata var.');
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Sunucu hatası.');
    }
};

module.exports = {
    getValue,
    updateStudent,
    getUserInfo,
    resetPassword,
    renderForgotPasswordPage
};