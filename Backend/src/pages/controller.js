
const { getBooksList } = require("./queries.js");
const pool = require("../../db.js");

const getMainPage = (req, res) => {
    const username = req.session ? req.session.username : "";
    res.render('index', {username: username, msg:req.msg}); // index.ejs dosyasını render et
};

const routeMain = (req, res) => {
    res.redirect('/'); // / adresine yönlendirme yap
};

const getBooksPage = (req, res) => {
    res.render('kitaplik', {username: req.session.username, books: ""}); 
};

const getCartsPage = async (req, res) => {
        const results = await pool.query(getBooksList, [888, 1]);
        const books = results.rows;
        res.render('cart',{value:1,books:books, username: req.session.username});
};

const getPromptPage = (req, res) => {
    res.render('prompt2', {username: req.session.username}); 
};

const getContactPage = (req, res) => {
    res.render('contact', {username: req.session.username}); 
};

const getcheckOutPage = (req, res) => {
    res.render('chackout', {username: req.session.username}); 
};

const getTestPage = (req, res) => {
    res.render('testimonial', {username: req.session.username}); 
};

const getSignupPage = (req, res) => {
    res.render('signup');
};

// Giriş sayfası
const getLoginPage = (req, res) => {
    res.render('login');
};

// Kayıt başarılı sayfası
const signSuccess = (req, res) => {
    res.render('signup-successful');
};

const getBookDetails = (req,res)=>{

    const bookTitle = req.bookTitle;
    const imageUrl = req.imgURL;
    return res.render('book-details',{title:bookTitle,author:req.author,publisher:req.publisher, description:req.bookDesc, imgURL : imageUrl, username:req.session.username});
}

// logoutSuccess olarak değiştirilecek.
const loginSucces = (req, res, next) => {
    req.session.destroy();
    req.msg = "Cikis basarili";
    next();
};


module.exports = {
    getMainPage,
    getBooksPage,
    getCartsPage,
    getContactPage,
    getcheckOutPage,
    getPromptPage,
    getTestPage,
    routeMain,
    loginSucces,
    signSuccess,
    getSignupPage,
    getLoginPage,
    getBookDetails,
};