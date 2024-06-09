const { Router } = require('express');
const { getValue, updateStudent, getUserInfo, resetPassword, renderForgotPasswordPage } = require("./controller");
const { authMiddleware } = require('../middlewares/authMiddlewares');

const router = Router();

router.post("/cart", getValue);
router.get('/chackout', authMiddleware, getUserInfo);
router.post('/checkout/:id', updateStudent);
router.post('/forgot-password', resetPassword);
router.get('/forgot-password', renderForgotPasswordPage); 

module.exports = router;
