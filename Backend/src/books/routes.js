const { Router } = require('express');
const { addToReadingList, searchTheBook } = require("./controller")


const router = Router();

router.post('/addList', addToReadingList);
router.post('/kitapAra',searchTheBook);

module.exports = router;