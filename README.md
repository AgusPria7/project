# project
 Creat two API

 Langkah Pertama
 membuat struktur project yang dimana akan terdapat beberapa folder/file sebagai berikut :
 - folder - (account-manager/)
 - folder - (payment-manager/)
 - docker-compose.yml

 Selanjutnya inisialisasi project -- account-manager
 (bash)
 - cd account-manager
 - npm init -y
 - npm install express mysql2 dotenv
 lalu membuat file index.js serta menambahkan Endpoint untuk login pengguna, pengelola akun, dan riwayat pembayaran.

 Selanjutnya inisialisasi project -- payment-manager
 (bash)
 - cd ../payment-manager
 - npm init -y
 - npm install express mysql2 dotenv
 lalu membuat file index.js serta menambahkan Logika untuk Endpoint /send dan /withdraw.

 Selanjutnya membuat skema database MySQL
 CREATE DATABASE account_db;
    USE account_db;

    CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
    );

    CREATE TABLE accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type VARCHAR(50),
    balance DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT,
    amount DECIMAL(10, 2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(50),
    status VARCHAR(50),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
    );

 Selanjutnya membuat file Dockerfile untuk kedua layanan.
 - account-manager/Dockerfile
 - payment-manager/Dockerfile
 serta membuat docker-compose.yml untuk mengaitkan DB account_db di MySQL.
