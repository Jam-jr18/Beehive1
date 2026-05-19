-- BEEHIVE RESTOBAR DATABASE SCHEMA
-- Use this in MySQL Workbench or Aiven Console

CREATE DATABASE IF NOT EXISTS beehive_db;
USE beehive_db;

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    name VARCHAR(255) PRIMARY KEY
);

-- 2. Menu Table
CREATE TABLE IF NOT EXISTS menu (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(255),
    description TEXT,
    image LONGTEXT, -- Stores Base64
    accentColor VARCHAR(20),
    FOREIGN KEY (category) REFERENCES categories(name) ON DELETE SET NULL
);

-- 3. Tables (Restaurant Seating)
CREATE TABLE IF NOT EXISTS tables (
    id VARCHAR(10) PRIMARY KEY,
    isOccupied BOOLEAN DEFAULT FALSE
);

-- 4. Settings (Payment Config)
CREATE TABLE IF NOT EXISTS settings (
    eWalletNumber VARCHAR(50),
    qrCodeUrl LONGTEXT
);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    customerName VARCHAR(255) NOT NULL,
    tableNumber VARCHAR(10),
    items JSON NOT NULL, -- Stores array of order items
    total DECIMAL(10, 2) NOT NULL,
    orderType VARCHAR(50) NOT NULL, -- 'Dine-in' or 'Take-out'
    paymentMethod VARCHAR(50) NOT NULL,
    paymentReference VARCHAR(255),
    paymentSender VARCHAR(255),
    timestamp BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending'
);

-- INITIAL SEED DATA
INSERT IGNORE INTO categories (name) VALUES 
('Burgers'), ('Chicken'), ('Rice'), ('Drinks'), ('Desserts'), ('Snacks');

INSERT IGNORE INTO tables (id, isOccupied) VALUES 
('1', 0), ('2', 0), ('3', 0), ('4', 0), ('5', 0),
('6', 0), ('7', 0), ('8', 0), ('9', 0), ('10', 0),
('11', 0), ('12', 0), ('13', 0), ('14', 0), ('15', 0),
('16', 0), ('17', 0), ('18', 0), ('19', 0), ('20', 0);

INSERT IGNORE INTO settings (eWalletNumber, qrCodeUrl) VALUES 
('09123456789', 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BeeHiveRestobar');
