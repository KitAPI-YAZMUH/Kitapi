const request = require('postman-request')

const pool = require("../../db.js");
const query = require("./queries.js");


// bununla tüm kitapları json olarak dündürürüz.
// url'nin nasıl çalıştığına bakmak gerekiyor.

const getAllBooksByName = (req, res) => {

    const { searchedBookName } = req.body; //Name bilgisi body'den geliyor.
    console.log(searchedBookName);

    //POSTMAN ile alttaki şekilde body'den isim değerini gönderiyoruz.
    //  {
    //     "searchedBookName": "Harry Potter"
    // } 

    // express de kullanabiliriz. şimdilik böyle durabilir.
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchedBookName}&key=AIzaSyCBPWsVkUF1AxRpuh1oCIZsAZ95reiGGG8`;
    request({ url: url, json: true }, (error, response) => {
        if (error) {
            console.log(error);
        } else if (response.body.totalItems == 0) {
            console.log("Girilen kitap bilgisi bulunamadı.");
        } else {
            console.log(response.body.totalItems);
        }
    });

};

// ÖNEMLİ NOT: Bu yaptığımız işlemleri yazarlar için de yapmamiz gerekiyor.
// ÖNEMLİ NOT 2: Kullanıcılar kitapları yıldızlayabilecekler mi?
//    // if yes: one göre sorgu yapmamız gerekiyor. 

// bir sayfada her zaman 10 tane kitap olacaksa bunu 10 tane getirecek şekilde yapacağız.
//yani tüm kitapları getirmeyeceğiz API den
const getNumberOfBooksByName = (req, res) => { // paging yaparak bi sayfada 10, 20 kitap göstereceğiz.

    const { searchedBookName } = req.body; //Name bilgisi body'den geliyor.
    console.log(searchedBookName);

};

// kitaba tıklanınca getirilecek bilgiler
const getOneBooksContentById = (req, res) => {

}

const getUsersBooksByCategory = (req, res) => {


}

const removeFromReadingList = (req, res) => {


}

const addToReadingList = (req, res) => {


}

const editBookInReadingList = (req, res) => {


}

// okuyorumdan okudum kısmına geçireceği zaman kullanacağız
const changeBooksCategoryInReadingList = (req, res) => {


}



module.exports = { getAllBooksByName, getOneBooksById }