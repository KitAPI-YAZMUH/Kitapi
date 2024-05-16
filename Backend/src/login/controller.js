const request = require('postman-request')
const crypto = require('crypto-js');
const pool = require("../../db.js");
const query = require("./queries.js");
const {session} = require("express-session");
const { cookie } = require('request');

// Kayıt olma işlemi
const signup = async (req, res) => {
    const { username, surname, email, password } = req.body; // Gelen istekten kullanıcı bilgileri alınır
    // Kullanıcı şifresi hashlenir
    const hashedPassword = crypto.SHA256(password).toString();
    const kayıtQuery = 'INSERT INTO users (username, surname, email, password) VALUES ($1, $2, $3, $4)';
    const kontrolQuery = 'SELECT * FROM users WHERE (username = $1 OR email = $2)'; 
    // PostgreSQL veritabanına yeni kullanıcı eklenir
    pool.query(kontrolQuery,[username,email], (error,results)=>{
        if(error) throw error;

        else if(results.rows.length != 0){ // o adın daha once alinmamasi icin
            return res.send({"msg": "Bu ad veya email daha once alinmis","Kisi": results.rows}).end();
        }
        else{
            pool.query(kayıtQuery, [username, surname, email, hashedPassword], (error, results) => {
                if (error) {
                    return res.status(500).send({"msg": "server tarafinda bir hata olustu"});
                } else {
                    return res.redirect('/signup-successful');
                }
            });     
        }
    })
};

// Giriş işlemi
const login = (req, res, next) => {
    const { email, password } = req.body; // Gelen istekten e-posta ve şifre alınır

    // PostgreSQL veritabanından kullanıcıyı bul
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
        if (error) {
            return res.status(500).send({"msg": 'Server tarafında bir hata oluştu, lütfen tekrar deneyin'});
        } else {
            if (results.rows.length == 0) {
                return res.status(404).send('Bu emaile sahip bir kullanıcı bulunamadı');
            } else {
                const user = results.rows[0];
                const hashedPassword = crypto.SHA256(password).toString();
                if (user.password !== hashedPassword) {
                    return res.status(401).send('Şifre yanlış');
                } else {
                    req.session.username = user.username; // kullanici adi ve id si session islemlerinde kullanilacak. // token da kullanabiliriz aklımda kalsın..
                    req.session.userId = user.id;
                    console.log(req.session.id); 
                    return res.redirect("/index"); // dogrulama basarili ise session islemlerini baslatan adima gecegiz.
                }
            }
        }
    });
};


// const logOutController = (req, res) => { // çıkış butonuna basildiğinda bu kısım çalışacak. session sonlandırılacak.
//     req.session.destroy(); // Syfaya istek atan req unutma cevap veren res o yüzden bu şekilde.
//     // Oturumu sonlandıracak.
//     console.log("ben")
//     res.redirect('index');

//     console.log(req.session);
// }



module.exports = {
    login,
    signup,
    // logOutController, gerek kalmadi middleware ile cok daha kolay bir sekilde halledildi.
};