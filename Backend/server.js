const express = require('express');
const bookRouters = require('./src/books/routes.js'); // Kitap rotaları
const bodyParser = require('body-parser'); // Gelen isteklerdeki verileri okumak için body-parser kullanılır
const crypto = require('crypto-js'); // Şifreleme işlemleri için crypto-js kullanılır
const path = require('path'); // Dosya yollarını düzenlemek için path modülü kullanılır
const request = require('request');
const db = require('./db'); // Veritabanı bağlantısı için db modülünü ekledik
const pool = db;

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
app.set('views', path.join(__dirname, '..', 'Frontend'));
// app.set('views', __dirname + '../Frontend');


// Header ve footer dosyalarını dahil et
app.use((req, res, next) => {
    res.locals.header = path.join(__dirname, '..', 'Frontend', 'partials', 'header.ejs'); // header.ejs dosyasını kullan
    res.locals.footer = path.join(__dirname, '..', 'Frontend', 'partials', 'footer.ejs'); // footer.ejs dosyasını kullan
    next();
});


// Ana sayfa
app.get('/', (req, res) => {
    res.render('index'); // index.ejs dosyasını render et
});

app.get('/index', (req, res) => {
    res.redirect('/'); // / adresine yönlendirme yap
});

app.get('/kitaplik', (req, res) => {
    res.render('kitaplik'); // kitaplik.ejs dosyasını render et
});

app.get('/cart', (req, res) => {
    res.render('cart'); // cart.ejs dosyasını render et
});

app.get('/prompt', (req, res) => {
    res.render('prompt'); // prompt.ejs dosyasını render et
});

app.get('/contact', (req, res) => {
    res.render('contact'); // contact.ejs dosyasını render et
});

app.get('/chackout', (req, res) => {
    res.render('chackout'); // chackout.ejs dosyasını render et
});

app.get('/testimonial', (req, res) => {
    res.render('testimonial'); // testimonial.ejs dosyasını render et
});

app.get('/404', (req, res) => {
    res.render('404'); // 404.ejs dosyasını render et
});

// Kayıt olma sayfası   
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Kayıt olma işlemi
app.post('/signup', (req, res) => {
    const { username, surname, email, password } = req.body; // Gelen istekten kullanıcı bilgileri alınır

    // Kullanıcı şifresi hashlenir
    const hashedPassword = crypto.SHA256(password).toString();

    // PostgreSQL veritabanına yeni kullanıcı eklenir
    pool.query('INSERT INTO users (username, surname, email, password) VALUES ($1, $2, $3, $4)', [username, surname, email, hashedPassword], (error, results) => {
        if (error) {
            console.error(error);
            if (error.constraint === 'users_email_key') {
                res.status(400).send('Bu e-posta adresi zaten kullanılmış');
            } else {
                res.status(500).send('Bir hata oluştu, lütfen tekrar deneyin');
            }
        } else {
            res.redirect('/signup-successful');
        }
    });
});

// Giriş sayfası
app.get('/login', (req, res) => {
    res.render('login');
});

// Giriş işlemi
app.post('/login', (req, res) => {
    const { email, password } = req.body; // Gelen istekten e-posta ve şifre alınır
    
    // PostgreSQL veritabanından kullanıcıyı bul
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Bir hata oluştu, lütfen tekrar deneyin');
        } else {
            if (results.rows.length === 0) {
                res.status(404).send('Bu e-posta adresine sahip bir kullanıcı bulunamadı');
            } else {
                const user = results.rows[0];
                const hashedPassword = crypto.SHA256(password).toString();
                if (user.password !== hashedPassword) {
                    res.status(401).send('Şifre yanlış');
                } else {
                    res.redirect(`/login-successful?username=${user.username}&surname=${user.surname}&email=${user.email}`);
                }
            }
        }
    });
});


// Kayıt başarılı sayfası
app.get('/signup-successful', (req, res) => {
    res.render('signup-successful');
});

// Giriş başarılı sayfası
app.get('/login-successful', (req, res) => {
    const username = req.query.username; // URL'den kullanıcı adı parametresi alınır
    res.render('login-successful');
});

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