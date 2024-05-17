const {chatBot} = require('./controller');
const {Router}= require('express');
const router = Router();

router.post('/prompt2', chatBot);

module.exports = router;

