const { getBooksList, getUser } = require("./queries.js");
const pool = require("../../db.js");
const request = require('request-promise-native'); // request-promise-native modülünü kullanarak promisify yapıyoruz

const getMainPage = (req, res) => {
  const username = req.session ? req.session.username : "";
  res.render("index", { username: username, msg: req.msg }); // index.ejs dosyasını render et
};

const routeMain = (req, res) => {
  res.redirect("/"); // / adresine yönlendirme yap
};

// const getBooksPage = (req, res) => {
//   res.render("kitaplik", { username: req.session.username, books: "" });
// };

// const getBooksPage = (req, res) => {
//   books = ["XqFnEAAAQBAJ", "ilnlAwAAQBAJ", "BiyMzgEACAAJ", "jJ-MSQAACAAJ", "JL2QzgEACAAJ", "aM2eRwAACAAJ"]
//   // const bookGoogleId;
    
//     const url = `https://www.googleapis.com/books/v1/volumes/${bookGoogleId}`;

//     request({ url: url, json: true }, (error, response, body) => {
//         if (error) {
//             console.error(error);
//             res.status(500).send('İstek sırasında bir hata oluştu');
//         } else if (body.totalItems == 0) {
//             console.log("Girilen kitap bilgisi bulunamadı.");
//             res.status(404).send('Girilen kitap bilgisi bulunamadı');
//         } else {
//             const theBook = body ? body : "";

//             if(theBook !== ""){
                
//             }
//             else{
//                 return res.status(404).send({"msg": "kitap bulunamadi"});
//             }
//         }
//     });
//   res.render("kitaplik", { username: req.session.username, books: "" });
// };


const getBooksPage = async (req, res) => {
  const books = ["XqFnEAAAQBAJ", "ilnlAwAAQBAJ", "BiyMzgEACAAJ", "jJ-MSQAACAAJ", "6Q1MEAAAQBAJ", "aM2eRwAACAAJ", "pfZxEAAAQBAJ", "ae_4DAAAQBAJ", "Gix1CQAAQBAJ", "EWPXEAAAQBAJ"];
  const baseUrl = `https://www.googleapis.com/books/v1/volumes/`;
  let combinedBooksData = []; // Gelen değerleri toplayacağımız değişken

  try {
    const bookPromises = books.map(bookId => request({ url: `${baseUrl}${bookId}`, json: true }));
    const bookResponses = await Promise.all(bookPromises);

    // Gelen verileri combinedBooksData değişkenine ekle
    bookResponses.forEach(book => {
      if (book) { // Geçerli kitapları kontrol et ve ekle
        combinedBooksData.push(book);
      }
    });
    console.log("combinedBooksData");
    console.log(combinedBooksData);
    if (combinedBooksData.length === 0) {
      res.status(404).send('Girilen kitap bilgisi bulunamadı');
    } else {
      res.render("kitaplik", { username: req.session.username, books: combinedBooksData });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('İstek sırasında bir hata oluştu');
  }
};

const getCartsPage = async (req, res) => {

        let value;
        if(req.params.id){
            console.log(req.params.id);
            value = req.params.id;
        }
        else{
            value = 1;
        }
        const results = await pool.query(getBooksList, [req.session.userId,value]);
        const books = results.rows;
        
        res.render('cart',{value:value ,books:books, username: req.session.username});

};

const getPromptPage = (req, res) => {
  res.render("prompt2", { username: req.session.username });
};

const getContactPage = (req, res) => {
  res.render("contact", { username: req.session.username });
};

const getcheckOutPage = (req, res) => {
  res.render("chackout", { username: req.session.username });
};

const getTestPage = (req, res) => {
  res.render("testimonial", { username: req.session.username });
};

const getSignupPage = (req, res) => {
  res.render("signup");
};

// Giriş sayfası
const getLoginPage = (req, res) => {
  res.render("login");
};

// Kayıt başarılı sayfası
const signSuccess = (req, res) => {
  res.render("signup-successful");
};

const getBookDetails = (req, res) => {
  const bookTitle = req.bookTitle;
  const imageUrl = req.imgURL;
 
  return res.render("book-details", {
    title: bookTitle,
    author: req.author,
    publisher: req.publisher,
    description: req.bookDesc,
    imgURL: imageUrl,
    username: req.session.username,
    categories: req.categories,
    publishedDate: req.publishedDate,
    pageCount: req.pageCount,
    language: req.language
  });
};

// logoutSuccess olarak değiştirilecek.
const loginSucces = (req, res, next) => {
  req.session.destroy();
  req.msg = "Cikis basarili";
  next();
};


module.exports = {
  getMainPage,
  getBooksPage,
  getCartsPage,
  getContactPage,
  getcheckOutPage,
  getPromptPage,
  getTestPage,
  routeMain,
  loginSucces,
  signSuccess,
  getSignupPage,
  getLoginPage,
  getBookDetails,
};
