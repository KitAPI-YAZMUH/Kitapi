const express = require('express');
const bookRouters = require('./src/books/routes.js'); // Kitap rotaları
const bodyParser = require('body-parser'); // Gelen isteklerdeki verileri okumak için body-parser kullanılır
const crypto = require('crypto-js'); // Şifreleme işlemleri için crypto-js kullanılır
const fs = require('fs'); // Dosya işlemleri için fs modülü kullanılır
const path = require('path'); // Dosya yollarını düzenlemek için path modülü kullanılır
const request = require('request');

const app = express();
const PORT = process.env.PORT || 5000; // Sunucu portu belirlenir, varsayılan olarak 3000 kullanılır

// Frontend dosyalarının yolu belirlenir
const frontendDirectory = path.join(__dirname, '..', 'Frontend');
// Express'e frontend dosyalarının statik olarak sunulması sağlanır
app.use(express.static(frontendDirectory));

// Gelen isteklerdeki form verilerini almak için body-parser kullanılır
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// EJS view engine'i ayarla
app.set('view engine', 'ejs');



// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, frontendDirectory, 'index.html')); // Ana sayfa dosyası gönderilir
});

// Kayıt olma sayfası
app.get('/signup', (req, res) => {
    res.sendFile(path.join(frontendDirectory, 'signup.html')); // Kayıt olma sayfası dosyası gönderilir
});

// Kayıt olma işlemi
app.post('/signup', (req, res) => {
    const { username, surname, email, password } = req.body; // Gelen istekten kullanıcı bilgileri alınır

    // Kullanıcı şifresi hashlenir
    const hashedPassword = crypto.SHA256(password).toString();
    // Yeni kullanıcı objesi oluşturulur
    const newUser = { username, surname, email, password: hashedPassword };

    // Kullanıcılar dosyası okunur
    fs.readFile('users.txt', 'utf8', (err, data) => {
        if (err) throw err;
        let users = JSON.parse(data);

        // Kullanıcı e-postası zaten kullanılmış mı kontrol edilir
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.send('Bu e-posta adresi zaten kullanılmış');
        }

        // Yeni kullanıcı users.txt dosyasına eklenir
        users.push(newUser);
        fs.writeFile('users.txt', JSON.stringify(users, null, 2), 'utf8', (err) => {
            if (err) throw err;
            res.redirect('/signup-successful'); // Başarılı kayıt olma sayfasına yönlendirilir
        });
    });
});

// Giriş sayfası
app.get('/login', (req, res) => {
    res.sendFile(path.join(frontendDirectory, 'login.html')); // Giriş sayfası dosyası gönderilir
});

// Giriş işlemi
app.post('/login', (req, res) => {
    const { email, password } = req.body; // Gelen istekten e-posta ve şifre alınır
    const hashedPassword = crypto.SHA256(password).toString(); // Şifre hashlenir

    // Kullanıcılar dosyası okunur
    fs.readFile('users.txt', (err, data) => {
        if (err) throw err;
        const users = JSON.parse(data);
        const user = users.find(u => u.email === email);

        if (!user) {
            res.send('Bu e-posta adresine sahip bir kullanıcı bulunamadı'); // Kullanıcı bulunamadıysa hata gönderilir
        } else if (user.password !== hashedPassword) {
            res.send('Şifre yanlış'); // Şifre yanlışsa hata gönderilir
        } else {
            res.redirect(`/login-successful?username=${user.username}&surname=${user.surname}&email=${user.email}`);
            // Giriş başarılıysa kullanıcı bilgileriyle başarılı giriş sayfasına yönlendirilir
        }
    });
});

// Kayıt başarılı sayfası
app.get('/signup-successful', (req, res) => {
    res.sendFile(path.join(frontendDirectory, 'signup-successful.html')); // Kayıt başarılı sayfası dosyası gönderilir
});

// Giriş başarılı sayfası
app.get('/login-successful', (req, res) => {
    const username = req.query.username; // URL'den kullanıcı adı parametresi alınır
    res.sendFile(path.join(frontendDirectory, 'login-successful.html')); // Giriş başarılı sayfası dosyası gönderilir
});

// app.get('/kitapAra', (req, res) => {
//     res.sendFile(path.join(frontendDirectory, 'kitapAra.html')); // Giriş başarılı sayfası dosyası gönderilir
// });



app.post('/kitapAra', (req, res) => {
    const { bookSearch } = req.body;
    console.log("bookSearch: " + bookSearch);

    const url = `https://www.googleapis.com/books/v1/volumes?q=${bookSearch}&key=AIzaSyCBPWsVkUF1AxRpuh1oCIZsAZ95reiGGG8`;

    request({ url: url, json: true }, (error, response, body) => {
        if (error) {
            console.error(error);
            res.status(500).send('İstek sırasında bir hata oluştu');
        } else if (body.totalItems == 0) {
            console.log("Girilen kitap bilgisi bulunamadı.");
            res.status(404).send('Girilen kitap bilgisi bulunamadı');
        } else {
            // EJS view engine'i kullanarak kitapara.ejs sayfasını render et
            res.render('kitapAra', { books: body.items });
        }
    });
});
// Kitap rotaları için /api/v1/books endpoint'i kullanılır
app.use('/api/v1/books', bookRouters);

// Sunucu belirlenen portta çalıştırılır
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});