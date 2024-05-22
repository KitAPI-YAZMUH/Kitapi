const getUser = "SELECT * FROM users WHERE id = $1";
const getBooksList = "SELECT * FROM kitap_listelerim WHERE kullanici_id = $1 AND kitap_durum = $2";
const getUserByEmail = 'SELECT * FROM users WHERE email = $1';

module.exports = { getBooksList, getUser, getUserByEmail };
