const { Router } = require('express');
const router = Router();

const {
    getMainPage,
    getBooksPage,
    getCartsPage,
    getContactPage,
    getTestPage,
    getPromptPage,
    routeMain,
    loginSucces,
    signSuccess,
    getSignupPage,
    getLoginPage,
    getBookDetails
    
} = require("./controller");

const { authMiddleware, logMiddleware } = require('../middlewares/authMiddlewares');
const {getBookById} = require('../books/controller');

router.get('/', getMainPage)
router.get('/index', routeMain)

router.get('/kitaplik', authMiddleware,getBooksPage)
router.get('/cart',  authMiddleware,getCartsPage)
router.get('/prompt', authMiddleware, getPromptPage)
router.get('/contact', getContactPage)
router.get('/testimonial',  authMiddleware,getTestPage)
router.get('/book-details', authMiddleware, getBookById, getBookDetails)


router.get('/signup',logMiddleware, getSignupPage)
router.get('/login',logMiddleware, getLoginPage)
router.get('/signup-successful',  authMiddleware, signSuccess)
router.get('/login-successful',  authMiddleware, loginSucces, routeMain); // 
// Çok önemli : redirect yalnızca rota saptırır gönderilen verilere hiçbir şey olmaz. 
// redirectten önce bir miidleware ile veri gönderdim ve bunu redirectr üzerinden ana sayfaya yönlendirdim.

module.exports = router;