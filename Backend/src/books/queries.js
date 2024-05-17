const addBookById = "INSERT INTO kitap_listelerim (kitap_google_id,kullanici_id,kitap_durum,ekleme_zamani,kitap_adi,yazar_adi,resim_url) VALUES ($1, $2, $3, $4, $5, $6,$7)";
const getBookByGoogleId = "SELECT * FROM kitap_listelerim WHERE kitap_google_id = $1 AND kullanici_id = $2";

module.exports = { addBookById, getBookByGoogleId};