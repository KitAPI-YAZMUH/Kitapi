# KitAPI  

  

KitAPI, kullanıcıların kitapları keşfetmelerine, listeler oluşturmalarına ve yapay zeka destekli öneriler alarak okuma deneyimlerini zenginleştirmelerine yardımcı olan bir web uygulamasıdır. Bu proje, Yazılım Mühendisliği dersi kapsamında geliştirilmiştir. 

  

## Proje Ekibi 

  

- **Esranur SEVİLMİŞ:** Frontend Geliştirici 

- **Burak ASLAN:** Frontend Geliştirici 

- **Emirhan SESİGÜR:**  Full Stack Geliştirici 

- **İbrahim AKSAN:** Full Stack Geliştirici 

- **Serdar AYVALI:** Full Stack Geliştirici 

  

  

## Proje Amacı 

  

KitAPI, kullanıcıların kitapları keşfetmeleri, kişisel listeler oluşturmaları ve yapay zeka destekli öneriler alarak okuma deneyimlerini zenginleştirmelerini sağlamak amacıyla geliştirilmiştir. Kullanıcılar, kitap detaylarını inceleyebilir, okuma listeleri oluşturabilir ve yapay zeka destekli öneriler alabilirler. 

  

## Kullanılan Teknolojiler 

  

### Yazılım Teknolojileri 

  

- **Node.js:** Backend geliştirme 

- **Express.js:** Web uygulama çerçevesi 

- **HTML/CSS/JavaScript:** Frontend geliştirme 

- **PostgreSQL:** SQL veritabanı 

- **Git ve GitHub:** Proje yönetimi ve sürüm kontrolü 

- **Google Books API:** Kitap verilerini çekmek için kullanılıyor 

- **Gemini AI API:** Yapay zeka destekli öneriler için kullanılıyor 

- **EJS (Embedded JavaScript Templates):** Server tarafında HTML sayfaları oluşturmak için şablon motoru 

  

## Özellikler 

  

- **Kitap Arama:** Kullanıcılar, Google Books API kullanarak kitap arayabilirler. 

- **Kitap Detayları:** Kullanıcılar, kitapların detay sayfalarını inceleyebilirler. 

- **Okuma Listeleri:** Kullanıcılar, okuma listeleri oluşturabilir ve yönetebilirler. 

- **Yapay Zeka Destekli Öneriler:** Gemini AI API kullanılarak kullanıcılara kitap önerileri sunulur. 

- **Kullanıcı Yönetimi:** Kullanıcılar, hesap oluşturabilir,  giriş yapabilir ve hesaplarını güncelleyebilirler. 

  

## Kurulum 

  

1. Projeyi klonlayın:


    ```bash 
    
    git clone https://github.com/KitAPI-YAZMUH/Kitapi.git 
    
    ``` 

  

2. Proje dizinine gidin: 

    ```bash 

    cd Kitapi 

    ``` 

  

3. Gerekli bağımlılıkları yükleyin: 

    ```bash 

    npm install 

    ``` 

  

4. Gerekli API anahtarlarını ve veritabanı bağlantı ayarlarını `.env` dosyasına ekleyin: 

    ```bash 

    touch .env 

    ``` 

    `.env` dosyası örneği: 

    ``` 

    DB_USER     = "your_postgres_username"  #default: postgres 

    DB_HOST     = "your_postgres_host"      #default: localhost 

    DB_NAME     = "your_database_name" 

    DB_PASSWORD = "your_database_password" 

    DB_PORT     = your_port_number          #default: 5432 

    SESSION_KEY = "your_session_key" 

    API_KEY = " your_gemini_ai_api_key 

    BOOK_API_KEY = “your_google_books_api_key” 

    ``` 

  

5. Uygulamayı başlatın: 

    ```bash 

    npm  Backend\server.js 

    ``` 

  

6. Tarayıcınızda [http://localhost:5500](http://localhost:5500) adresini ziyaret ederek uygulamayı görüntüleyin. 

  

## Katkıda Bulunma 

  

Katkılarınızı memnuniyetle karşılıyoruz. Lütfen aşağıdaki adımları izleyin: 

  

1. Bu depoyu fork'layın. 

2. Yeni bir dal oluşturun: `git checkout -b yeni-ozellik` 

3. Değişikliklerinizi commit'leyin: `git commit -m 'Yeni özellik ekle'` 

4. Dalınıza push'layın: `git push origin yeni-ozellik` 

5. Bir pull request oluşturun. 

   

## Lisans 

  

Bu proje MIT lisansı ile lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakabilirsiniz. 

  

--- 

  

Herhangi bir sorunuz veya geri bildiriminiz varsa, lütfen bizimle iletişime geçin. Destekleriniz için teşekkür ederiz! 💪 

  

``` 
