const express = require('express');
const bodyParser = require('body-parser'); // Gelen isteklerdeki verileri okumak için body-parser kullanılır
const path = require('path'); // Dosya yollarını düzenlemek için path modülü kullanılır
const session = require('express-session');
const userLogin = require('./src/login/routes');
const showPages = require('./src/pages/routes');
const bookRoutes = require('./src/books/routes');
const userRoutes = require('./src/users/routes');
const chatRoutes = require('./src/chat/routes');
const app = express();
const PORT = process.env.PORT || 5500; // Sunucu portu belirlenir, varsayılan olarak 3000 kullanılır

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

app.use(session({ // oturumu middleware olarak eklemek gerekiyor ki her yerde çalışabilsin. Burası aslında session starttır.
    secret: process.env.SESSION_KEY, // bu kısım güvenlik açısından önemli. Bun env'den alıcaz.
    resave: false,
    saveUninitialized: false, 
    visited: true, // login sistemini geçtikten sonra her requestte başka bir id oluşturmaması için 
    // bunun false olması gerekiyor.
    cookie: {
        secure: false, // Sadece HTTPS üzerinden gönderilmesi gerekiyorsa true olarak ayarlayın
        maxAge: 60000*60, // Oturum cookie'sinin ömrü (milisaniye cinsinden) - örneğin, 1 saat
        httpOnly: false // Tarayıcı JavaScript tarafından erişilemez
    },
})); // Bu middlewareı kullanmaya başladıktan sonra req içinde session diye bir şeyde gelecek. Bazı özellikleri vawr.

app.use((req, res, next) => { // Bunu yazmamızn sebebi session bilgilerini her yerde kullanabilmemiz.
    res.locals.session = req.session;
    next();
}) // Bu middlewareı kullanmaya başladıktan sonra req içinde session diye bir şeyde gelecek. Bazı özellikleri vawr.

app.use('/user', userLogin); // login ve signup işlemleri
app.use('/', showPages, userRoutes, chatRoutes);
app.use('/book', bookRoutes);

app.use((req,res)=>{ // olmayan bir sayfa arandığında burası çalışacak. en alta koymak gerekli bunu
    return res.render('404');
})

// Sunucu belirlenen portta çalıştırılır
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});