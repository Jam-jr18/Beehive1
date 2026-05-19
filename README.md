# 🐝 BeeHive Restobar - Deployment Guide

This guide will walk you through deploying your **BeeHive Restobar** application using GitHub, Render, Aiven (MySQL), and MySQL Workbench.

---

## 1. Database Setup (Aiven & Workbench)

### A. Create MySQL Instance on Aiven
1.  Sign up at [Aiven.io](https://aiven.io/).
2.  Create a new **MySQL** service.
3.  Choose the **Free Tier** (if available) or the smallest plan.
4.  Once the service is "Running", look for the **Connection Details**:
    *   **Host**
    *   **Port**
    *   **User** (usually `avnadmin`)
    *   **Password**
    *   **Database Name** (default is usually `defaultdb`, but you can create `beehive_db`)

### B. Connect via MySQL Workbench & Create Tables
1.  Open **MySQL Workbench**.
2.  Click `+` to add a new connection.
3.  Enter the details from Aiven (Host, Port, User).
4.  Once connected, open a new SQL Script tab.
5.  **Paste the following SQL Prompt** into the tab to create your database structure:

```sql
-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS beehive_db;
USE beehive_db;

-- 2. Create Categories Table
CREATE TABLE categories (
    name VARCHAR(255) PRIMARY KEY
);

-- 3. Create Menu Table
CREATE TABLE menu (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(255),
    description TEXT,
    image LONGTEXT,
    accentColor VARCHAR(20),
    FOREIGN KEY (category) REFERENCES categories(name) ON DELETE SET NULL
);

-- 4. Create Tables (Seating)
CREATE TABLE tables (
    id VARCHAR(10) PRIMARY KEY,
    isOccupied BOOLEAN DEFAULT FALSE
);

-- 5. Create Settings Table
CREATE TABLE settings (
    eWalletNumber VARCHAR(50),
    qrCodeUrl LONGTEXT
);

-- 6. Create Orders Table
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    customerName VARCHAR(255) NOT NULL,
    tableNumber VARCHAR(10),
    items JSON NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    orderType VARCHAR(50) NOT NULL,
    paymentMethod VARCHAR(50) NOT NULL,
    paymentReference VARCHAR(255),
    paymentSender VARCHAR(255),
    timestamp BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending'
);

-- 7. Insert Initial Seed Data
INSERT INTO categories (name) VALUES ('Burgers'), ('Chicken'), ('Rice'), ('Drinks'), ('Desserts'), ('Snacks');
INSERT INTO tables (id, isOccupied) SELECT id, 0 FROM (SELECT '1' as id UNION SELECT '2' UNION SELECT '3' UNION SELECT '4' UNION SELECT '5' UNION SELECT '6' UNION SELECT '7' UNION SELECT '8' UNION SELECT '9' UNION SELECT '10' UNION SELECT '11' UNION SELECT '12' UNION SELECT '13' UNION SELECT '14' UNION SELECT '15' UNION SELECT '16' UNION SELECT '17' UNION SELECT '18' UNION SELECT '19' UNION SELECT '20') as t;
INSERT INTO settings (eWalletNumber, qrCodeUrl) VALUES ('09123456789', 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BeeHiveRestobar');
```

6.  **Execute** (⚡) the script to set up everything.

---

## 2. GitHub Preparation

1.  Create a new repository on [GitHub](https://github.com/).
2.  In your local project folder, run:
    ```bash
    git init
    git add .
    git commit -m "Initial BeeHive Release"
    git remote add origin YOUR_GITHUB_REPO_URL
    git push -u origin main
    ```

---

## 3. Live Deployment (Render)

### A. Create Web Service
1.  Sign up at [Render.com](https://render.com/).
2.  Click **New +** > **Web Service**.
3.  Connect your GitHub repository.

### B. Configuration
*   **Runtime**: `Node`
*   **Build Command**: `npm install && npm run build`
*   **Start Command**: `node server.js`

### C. Environment Variables (CRITICAL)
Go to the **Environment** tab in Render and add these variables from your Aiven details:

| Key | Value |
| :--- | :--- |
| `DB_HOST` | your-aiven-host.aivencloud.com |
| `DB_USER` | avnadmin |
| `DB_PASSWORD` | your-aiven-password |
| `DB_NAME` | defaultdb (or beehive_db) |
| `DB_PORT` | 3306 (usually) |
| `NODE_ENV` | production |

---

## 4. How the System Works (Data Flow)

The system is a fully integrated **Full-Stack Application**. This means your data is **not** temporary; it is stored permanently in your MySQL database.

1.  **Permanent Storage**: Every menu item you add, every category you create, and every order placed by a customer is sent to the Node.js server and stored in **MySQL tables**.
2.  **Real-Time Dashboard**: When the Admin opens the dashboard, the system queries the database to calculate Daily, Monthly, and Yearly sales in real-time.
3.  **Live Kitchen**: When a customer orders, the record is inserted into the `orders` table. The Staff terminal immediately sees this new record because it "polls" the database for updates.
4.  **Table Management**: The `tables` table in MySQL keeps track of which tables are currently occupied.

**Important**: Once you deploy to Render and Aiven, the default demo data (like the sample burgers) is replaced by your own live data stored in the cloud.

---

### Troubleshooting
*   **SSL Errors**: The server is configured with `ssl: { rejectUnauthorized: false }` which is required for Aiven.
*   **Images**: Menu images are stored as Base64 strings in the database.
*   **Tables**: The system automatically occupies/frees tables (1-20) based on order status.
