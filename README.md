# NRK Aura - Luxury Bangles

This is a high-end e-commerce React application.

## ⚠️ IMPORTANT: Database Connection
This React app runs in the browser. To connect to MySQL, you must run a **Node.js backend**.
I have created the connection file in `server/db.js` and authentication logic in `server/auth.js`.

### How to Connect to MySQL
1.  **Install Dependencies**:
    Open your terminal and run:
    ```bash
    npm install mysql2 dotenv express cors
    ```

2.  **Verify .env**:
    Check the `.env` file in the root directory. It should have your password:
    ```
    DB_PASSWORD=aicareer
    ```

3.  **Run Server**:
    Run the auth server script:
    ```bash
    node server/auth.js
    ```

---

## Edited Query (Run this to update Users Table)

Since you want to store address and phone number for auto-checkout, run this query to update your existing `users` table:

```sql
ALTER TABLE users 
ADD COLUMN phone VARCHAR(20),
ADD COLUMN address TEXT,
ADD COLUMN city VARCHAR(100),
ADD COLUMN state VARCHAR(100),
ADD COLUMN zip VARCHAR(20);
```

---

## MySQL Database Schema (Full)

To store your data in a MySQL database, run these SQL queries in your MySQL Workbench or phpMyAdmin.

### 1. Create Database
```sql
CREATE DATABASE nrk_aura_db;
USE nrk_aura_db;
```

### 2. Create Users Table
```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, 
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip VARCHAR(20)
);

-- Insert default admin
INSERT INTO users (id, name, email, password, role) VALUES 
('admin1', 'NRK Admin', 'admin@nrkaura.com', 'admin', 'admin');
```

### 3. Create Products Table
```sql
CREATE TABLE products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(255),
    tag_name VARCHAR(50),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

### 4. Create Reviews Table
```sql
CREATE TABLE reviews (
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255),
    user_id VARCHAR(255),
    user_name VARCHAR(255),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    date DATE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 5. Create Orders Table
```sql
CREATE TABLE orders (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),
    order_date DATE,
    status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    total_amount DECIMAL(10, 2),
    payment_method VARCHAR(50),
    shipping_name VARCHAR(255),
    shipping_email VARCHAR(255),
    shipping_address TEXT,
    shipping_city VARCHAR(100),
    shipping_zip VARCHAR(20),
    shipping_state VARCHAR(100),
    shipping_phone VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(255),
    product_id VARCHAR(255),
    product_name VARCHAR(255),
    quantity INT,
    price DECIMAL(10, 2),
    image_url TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

### 6. Create Site Content Tables (For Admin CMS)

**Site Settings**
```sql
CREATE TABLE site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    brand_name VARCHAR(255),
    brand_subtitle VARCHAR(255),
    logo_url TEXT,
    footer_about_title VARCHAR(255),
    footer_about_text TEXT,
    contact_email VARCHAR(255),
    social_instagram TEXT,
    social_facebook TEXT,
    social_pinterest TEXT,
    invoice_address TEXT,
    invoice_prefix VARCHAR(20),
    order_prefix VARCHAR(20)
);
```

**Home Page Content**
```sql
CREATE TABLE home_content (
    id INT PRIMARY KEY DEFAULT 1,
    hero_title VARCHAR(255),
    hero_subtitle VARCHAR(255),
    hero_image TEXT,
    home_video_url TEXT, -- Use this for Poetry in Motion video
    marquee_text TEXT,
    trends_title VARCHAR(255),
    trends_subtitle VARCHAR(255),
    trend1_title VARCHAR(255),
    trend1_image TEXT,
    trend2_title VARCHAR(255),
    trend2_image TEXT,
    video_section_title VARCHAR(255),
    video_section_subtitle VARCHAR(255),
    featured_title VARCHAR(255),
    featured_subtitle VARCHAR(255),
    editorial_title VARCHAR(255),
    editorial_text TEXT,
    editorial_image TEXT,
    editorial_video TEXT
);
```

**About Page Content**
```sql
CREATE TABLE about_content (
    id INT PRIMARY KEY DEFAULT 1,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    hero_image TEXT,
    stat1_value VARCHAR(50), stat1_label VARCHAR(50),
    stat2_value VARCHAR(50), stat2_label VARCHAR(50),
    stat3_value VARCHAR(50), stat3_label VARCHAR(50),
    story_title VARCHAR(255),
    story_text TEXT,
    story_image TEXT,
    craftsmanship_title VARCHAR(255),
    craftsmanship_text TEXT,
    craftsmanship_video TEXT,
    philosophy_title VARCHAR(255),
    philosophy_subtitle VARCHAR(255),
    value1_title VARCHAR(255), value1_desc TEXT,
    value2_title VARCHAR(255), value2_desc TEXT,
    value3_title VARCHAR(255), value3_desc TEXT,
    process_title VARCHAR(255),
    step1_title VARCHAR(255), step1_desc TEXT, step1_image TEXT,
    step2_title VARCHAR(255), step2_desc TEXT, step2_image TEXT,
    step3_title VARCHAR(255), step3_desc TEXT, step3_image TEXT
);
```

**Gallery & Testimonials**
```sql
CREATE TABLE gallery (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255),
    image_url TEXT,
    description TEXT
);

CREATE TABLE testimonials (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    title VARCHAR(255),
    content TEXT,
    image_url TEXT
);
```