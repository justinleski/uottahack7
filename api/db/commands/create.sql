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

INSERT INTO users_main (slug)
VALUES
    ('leopard'),
    ('cougar'),
    ('capybara'),
    ('deer'),
    ('horse'),
    ('dog'),
    ('grate'),
    ('beaver'),
    ('goose'),
    ('ant'),
    ('zebra'),
    ('cow'),
    ('crow'),
    ('butterfly'),
    ('wildcat'),
    ('otter'),
    ('dog_shelter');

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

CREATE TABLE IF NOT EXISTS users_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    url VARCHAR(256) NOT NULL,
    animal varchar(256) not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fl_users_main_user_id FOREIGN KEY (user_id) REFERENCES users_main(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS friends (
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, friend_id),
    CONSTRAINT fk_friends_user FOREIGN KEY (user_id) REFERENCES users_main(id) ON DELETE CASCADE,
    CONSTRAINT fk_friends_friend FOREIGN KEY (friend_id) REFERENCES users_main(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS friend_requests (
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, friend_id),
    CONSTRAINT fe_friends_user FOREIGN KEY (user_id) REFERENCES users_main(id) ON DELETE CASCADE,
    CONSTRAINT fo_friends_friend FOREIGN KEY (friend_id) REFERENCES users_main(id) ON DELETE CASCADE
);

create table if not exists users_coins (
    id INT PRIMARY KEY,
    balance INT DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fn_users_login_id FOREIGN KEY (id) REFERENCES users_main(id) ON DELETE CASCADE
);

create table if not exists avatars (
    avatar_id INT PRIMARY KEY,
    price INT DEFAULT 0,
    url VARCHAR(256) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

create table if not exists hats (
    hat_id INT PRIMARY KEY,
    price INT DEFAULT 0,
    url VARCHAR(256) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

create table if not exists avatars_ownership (
    o_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    avatar_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

create table if not exists hats_ownership (
    o_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    hat_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

create table if not exists users_coins_earned (
    id INT PRIMARY KEY,
    balance INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fx_users_login_id FOREIGN KEY (id) REFERENCES users_main(id) ON DELETE CASCADE
);

create table if not exists currents (
    id INT PRIMARY KEY,
    hat_id INT DEFAULT 0,
    avatar_id INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fu_users_login_id FOREIGN KEY (id) REFERENCES users_main(id) ON DELETE CASCADE
);

INSERT INTO hats (hat_id, price, url)
VALUES
    (1, 1, 'https://uottawa7.s3.us-east-1.amazonaws.com/ef153d069f5d51fb234aaacdf90cbae9.jpg'),
    (2, 2, 'https://uottawa7.s3.us-east-1.amazonaws.com/pngtree-mens-annual-meeting-gentleman-top-hat-png-image_3053728.jpg'),
    (3, 5, 'https://uottawa7.s3.us-east-1.amazonaws.com/sun-hat-png-isolated-transparent-background_191095-9871.jpg.avif');
