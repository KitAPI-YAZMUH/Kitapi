const request = require('postman-request')

const pool = require("../../db.js");
const { addBookById, getBookByGoogleId } = require("./queries.js");



const changeBookStatus = (req, res) => {
    console.log("sıkıntı yok",req.body)

    try {
        const { bookId, status } = req.body;

        if(status == 4){
            pool.query("DELETE FROM kitap_listelerim WHERE kitap_google_id = $1 AND kullanici_id = $2",[bookId,req.session.userId]);
        }

        pool.query("UPDATE kitap_listelerim SET kitap_durum = $1 WHERE kitap_google_id = $2 AND kullanici_id = $3", [status, bookId, req.session.userId])
        
        res.status(200).send({ success: true, status});
    } catch (error) {
        console.log("sıkıntı yok2",req.body)
        res.status(500).send({ success: false, error: "Kitap durumu güncellenirken bir hata oluştu" });
    }
};

const getBookById = (req, res, next) => {
    const bookGoogleId = req.query.id;
    
    const url = `https://www.googleapis.com/books/v1/volumes/${bookGoogleId}`;

    request({ url: url, json: true }, (error, response, body) => {
        if (error) {
            console.error(error);
            res.status(500).send('İstek sırasında bir hata oluştu');
        } else if (body.totalItems == 0) {
            console.log("Girilen kitap bilgisi bulunamadı.");
            res.status(404).send('Girilen kitap bilgisi bulunamadı');
        } else {
            const theBook = body ? body : "";

            if(theBook !== ""){
                req.bookTitle = theBook.volumeInfo.title;
                req.author = theBook.volumeInfo.authors[0];
                req.publisher = theBook.volumeInfo.publisher;
                req.bookDesc = theBook.volumeInfo.description;
                req.imgURL = theBook.volumeInfo.imageLinks.thumbnail;
                req.categories = theBook.volumeInfo.categories;
                req.publishedDate = theBook.volumeInfo.publishedDate;
                req.pageCount = theBook.volumeInfo.pageCount;
                req.language = theBook.volumeInfo.language;

       
                next();
            }
            else{
                return res.status(404).send({"msg": "kitap bulunamadi"});
            }
        }
    });
};


// const getNumberOfBooksByName = (req, res) => { // paging yaparak bi sayfada 10, 20 kitap göstereceğiz.

//     const { searchedBookName } = req.body; //Name bilgisi body'den geliyor.
//     console.log(searchedBookName);

// };

const addToReadingList = (req, res) => {

    const { id } = req.body; // KİTABIN unique id sini çeker.
    const userId = req.session.userId;
    console.log(req.body);

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const tarih = `${year}-${month}-${day}`;

    pool.query(getBookByGoogleId, [id, userId], (error, results) => {
        if (error) throw error;
        const kitapVar = results.rows.length;
        if (kitapVar) {
            return res.status(200).send({ success: false });
        }
        let thumbnaiL;
        if("imageLinks" in req.body.volumeInfo){ //  bazi kitaplarda resim olmadiginda ekiyordu ama imageLinksi olmayan kitaplar bulduk
            // onun icin duzenleme yapildi - ibrahimburak
            thumbnaiL = req.body.volumeInfo.imageLinks.thumbnail;
            console.log(thumbnaiL);
        }
        else{
            thumbnaiL = "";
            console.log(thumbnaiL)
        }
        pool.query(addBookById, [id, userId, 1, tarih, req.body.volumeInfo.title, req.body.volumeInfo.authors[0],thumbnaiL], (error,
            results) => {
            if (error) {
                return res.status(200).send({ success: false });
            };
            return res.status(200).send({ success: true });
        })
    })
}


const searchTheBook = (req, res) => {

    const { bookSearch } = req.body;
    console.log("bookSearch: " + bookSearch); // aranacak kitabın ismini yazar.

    const url = `https://www.googleapis.com/books/v1/volumes?q=${bookSearch}&key=${process.env.BOOK_API_KEY}`;

    request({ url: url, json: true }, (error, response, body) => {
        if (error) {
            console.error(error);
            res.status(500).send('İstek sırasında bir hata oluştu');
        } else if (body.totalItems == 0) {
            console.log("Girilen kitap bilgisi bulunamadı.");
            res.status(404).send('Girilen kitap bilgisi bulunamadı');
        } else {
            // EJS view engine'i kullanarak kitapara.ejs sayfasını render et
            const books = body.items ? body.items : "";
            res.render('kitapAra', {books: books, username: req.session.username});
        }
    });
};

// listlerim kısmındaki kitap islemlerini burada halledeceğim.
const getOneBooksContentById = (req, res) => {

}

const getUsersBooksByCategory = (req, res) => {


}

const removeFromReadingList = (req, res) => {


}



const editBookInReadingList = (req, res) => {


}

// okuyorumdan okudum kısmına geçireceği zaman kullanacağız
const changeBooksCategoryInReadingList = (req, res) => {


}



module.exports = {addToReadingList, searchTheBook, getBookById, changeBookStatus };