const { Router } = require('express');
const {getValue } = require("./controller");
// const { authMiddleware } = require('../middlewares/authMiddlewares'); // gerekirse kullanırım.

const router = Router();

router.post("/cart", getValue);

module.exports = router;