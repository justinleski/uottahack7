CREATE DATABASE IF NOT EXISTS wild_around;

use wild_around;

-- this is the main table for basically referencing the slug and the id
-- for security, slug is exposed, and id (which is the number) is never exposed
create table if not exists users_main (
    id INT AUTO_INCREMENT UNIQUE,
    slug VARCHAR(32) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- this is the table for users private details for login, such as email and password
create table if not exists users_login (
    id INT PRIMARY KEY,
    email_hash VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_login_id FOREIGN KEY (id) REFERENCES users_main(id) ON DELETE CASCADE
);

create table if not exists users_personal (
    id INT PRIMARY KEY,
    name VARCHAR(128),
    fav_animal VARCHAR(128),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fp_users_login_id FOREIGN KEY (id) REFERENCES users_main(id) ON DELETE CASCADE
);




