# Multi-Vendor E-Commerce Store

![Blog Screenshot](https://github.com/Mehdi-Zarei/Online-Shop/raw/38b22f98f4d9b9a9c22be48f7c771a3f8f42ac33/public/images/products/pngtree-online-shopping-design-png-image_5344692.jpg)

## 🛒 Project Overview

This project is a multi-vendor e-commerce platform that allows users to register, browse and purchase products, and vendors to list their own items for sale. Payments are processed through the **Zarinpal** gateway, and users can leave reviews for products.

## ✨ Features and Capabilities

### 🔐 Authentication and User Management

- User registration via OTP, stored in Redis and resendable after 1 minute.
- Registration details include `phone`, `otp`, `name`, `email`, `password`.
- Password hashing with `bcrypt.js` and storage in the database.
- Generation of `access token` and `refresh token` using `JWT`, with a 15-minute validity for `access token` and a 30-day validity for `refresh token`.
- Storing hashed `refresh token` in Redis using `bcrypt.js`.
- The first user to register is considered the site owner, and subsequent users are assigned a regular role.
- OTP-based login and login through `passport` (local and Google).
- Admin can ban users.
- Admin can change user roles.
- User data can be retrieved via `access token`.
- Password reset via email link (using `nodemailer`).
- User address management including add, edit, delete, and view addresses, with the ability to save geographical location from the map.
- Cities are displayed based on the selected province.

### 📁 Category Management

- Ability to create nested categories up to three levels (main category, subcategory, and subsubcategory).
- Ability to delete, edit, and view categories.
- Categories can be fetched in a hierarchical and related manner.

### 💬 Comment Management

- Users can post comments on products.
- Comment replies are supported.
- Comments are displayed after admin approval.
- Users can view their own comments.
- Admin can view and delete any comments.

### 📝 Notes

- Users can add notes to products.
- Notes remain until the product is deleted.
- Users can edit and delete their notes.
- All notes added by a user are visible in their user panel.

### 🛍️ Product Management

- Vendors can create products with image upload (`multer`).
- Ability to define specific attributes for each product (e.g., color, size).
- Pagination for products, comments, notes, and orders to optimize performance.
- Product comments are displayed only when clicked by users for better performance.
- Ability to fetch products with various filters via `aggregate`.
- Admin can edit, delete, and view products.
- Short links for products (using `nanoid`).
- Products are assigned unique slugs using `slugify`.

### 🏪 Vendor Management

- Vendor registration (after admin approval).
- Vendor product supply requests.
- Vendors can view and manage their store information.
- Admin can disable or delete a vendor's store.
- Admin can view, approve, or reject vendor requests, with pagination for performance improvement.

### 🛒 Shopping Cart and Orders

- Users can add products to the shopping cart.
- Users can view products in the cart along with the total price.
- Users can view purchases from multiple vendors in the shopping cart.
- Users can remove items from the cart.

### 💳 Payments and Order Management

- Payments via **Zarinpal** gateway (using `sandbox` for testing).
- Product stock is checked before confirming the order.
- Users can view the order status (`Processing`, `Shipped`, `Delivered`).
- Admin can change order status and register the tracking code.

## 🛠️ Technologies and Tools Used

- **Node.js** and **Express.js** as the main framework.
- **MongoDB** with **Mongoose** as the database.
- **Redis** for storing temporary data like OTP and `refresh token`.
- **bcrypt.js** for hashing passwords and `refresh token`.
- **JWT** for authentication management.
- **Yup** for input validation.
- **Passport.js** for Google login and token-based authentication.
- **Nodemailer** for sending confirmation emails and password reset links.
- **Axios** for OTP requests, payment, and verification.
- **Multer** for handling image uploads.
- **Nanoid** for creating short product links.
- **Slugify** for generating unique product slugs.
- **UUID** for generating password reset links.
- **Swagger** for API documentation.

## 🚀 How to Run

### Prerequisites

- Install `Node.js` and `MongoDB`.
- Install `Redis`.

### Install Dependencies

```bash
npm install
```

### Run the Project

```bash
npm start
```

### Or for development mode:

```bash
npm start
```

📄 API Documentation

Once the project is running, the API documentation will be available at [http://localhost:3000/apis/v1/](http://localhost:3000/apis/v1/).

---
