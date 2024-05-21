const { Router } = require('express');
const { addToReadingList, searchTheBook, changeBookStatus } = require("./controller")
const {getValue} = require('../users/controller');

const router = Router();

router.post('/addList', addToReadingList);
router.post('/kitapAra',searchTheBook);
router.post('/cart', getValue, changeBookStatus);

module.exports = router;    