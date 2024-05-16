const getBooksList = "SELECT * FROM kitap_listelerim WHERE kullanici_id = $1 AND kitap_durum = $2"

module.exports = { getBooksList }