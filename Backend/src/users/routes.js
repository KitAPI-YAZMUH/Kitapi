const { Router } = require('express');
const {getValue,updateStudent,getUserInfo} = require("./controller");
const { authMiddleware } = require('../middlewares/authMiddlewares');

const router = Router();

router.post("/cart", getValue);
router.get('/chackout',  authMiddleware,getUserInfo)
router.post('/chackout/:id',updateStudent);


module.exports = router;