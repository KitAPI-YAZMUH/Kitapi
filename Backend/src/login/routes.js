const { Router } = require('express');
const { signup, login} = require("./controller")
// const { authMiddleware } = require('../middlewares/authMiddlewares');

const router = Router();

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;