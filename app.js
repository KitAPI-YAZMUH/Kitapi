const express= require('express');
const request = require('postman-request');
const app = express();
const key = 'AIzaSyCBPWsVkUF1AxRpuh1oCIZsAZ95reiGGG8'; // api key;
const fs = require('fs');

// Middlewares
app.use(express.json()); // form datasını json olarak aktarmya yarar.
app.use(express.urlencoded()); // html dosyaları arasında gönderilen dosyaları 
// kodlar.
app.use(express.static('public')); // public dosyalarımızı server da kullanabilmek için static yapmammız gerekli.

app.get('/form',(req,res)=>{ // / form ile get isteği attığımızda bizi index.html e yönlendirecek.
    res.sendFile(__dirname + '/public/index.html'); 
})

app.post('/formPost',(req,res)=>{

    const data = req.body; // form datası req.body içerisindedir. Form içeriği name : değer oalrak  nesne olarak gönderiliyor.
    const book = data.bookToSearch; 
    const bookURL = `https://www.googleapis.com/books/v1/volumes?q=${book}&key=${key}`; // Kitap arama apisinin urlsi

    request({url:bookURL}, async (err,response,body)=>{
        
        if(err){
            console.log('Hata ile karşılaşıldı.');
            return;
        }

        const books = JSON.parse(body);
        const items = books["items"]; 
        let itemNumber = 1;
        let text = "";
        
        for(i = 0;i<5; i++){
            text += itemNumber + ")" + items[i].volumeInfo.title + "\n\n" + items[i].volumeInfo.description+"\n\n" ;
            itemNumber += 1;
        }

        fs.writeFile('searchResults.txt', text, (err) => { // şimdilik dosyaya yazmakta. Projeye entegre edildiğinde 
            // görsel arayüzle birlikte sorgudan dönen kitaplar çıkacaktır.
            if (err) {
                console.log("dosya yazdirilamadi.");
            };

            console.log("dosya yazdirildi.");
        })
    })
    res.send(`<h1>ARAMA SONUÇLARI DOSYAYA YAZILDI.</h1>`);
    res.end();
})

app.listen(5000,()=>{
    console.log("server calisiyor.");
})

