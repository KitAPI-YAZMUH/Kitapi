const { Pool } = require('pg');
require('dotenv').config(); // .env dosyasındaki ortam değişkenlerini yüklemek için dotenv modülünü kullanın

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Tablo var mı kontrol et ve yoksa oluştur
pool.query(
    `SELECT EXISTS (
        SELECT 1
        FROM   information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name = 'users'
    );`,
    (error, results) => {
        if (error) {
            console.error('Tablo varlığı kontrol edilirken bir hata oluştu:', error);
            return;
        }
        
        const tableExists = results.rows[0].exists;
        if (!tableExists) {
            // Tablo yoksa oluştur
            pool.query(
                `CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(100),
                    surname VARCHAR(100),
                    email VARCHAR(100) UNIQUE,
                    password VARCHAR(255)
                );`,
                (error, results) => {
                    if (error) {
                        console.error('Tablo oluşturulurken bir hata oluştu:', error);
                        return;
                    }
                    console.log('Users tablosu oluşturuldu');
                }
            );
        } else {
            console.log('Users tablosu zaten mevcut');
        }
    }
);

module.exports = pool;