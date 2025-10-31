<h1 align="center">⚡ ElectroShop – Full-Stack E-Commerce Platform</h1>

<p align="center">
  A complete online shopping system built with <b>React</b> + <b>Spring Boot</b> + <b>MySQL</b>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2BTypeScript-61DAFB?style=for-the-badge&logo=react">
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot">
  <img src="https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql">
</p>

---

## 🛍️ Overview

ElectroShop is a **full-featured eCommerce platform** with:
- Customer shopping experience
- Admin product management
- Cart & order system
- Secure login with JWT authentication

---

## 🧩 Features

### ✅ Customer Features
| Feature | Description |
|--------|-------------|
| Browse Products | Search & filter products |
| Product View | View images, price, description |
| Shopping Cart | Add / Remove / Update items |
| Checkout & Orders | Place orders & view history |
| Authentication | Register, Login, Secure access |

### 🛠️ Admin Features
| Feature | Description |
|--------|-------------|
| Admin Dashboard | Manage store data |
| Product Management | Add / Edit / Delete products |
| User Management | Update user roles |
| Order Management | Track & update order status |

Admin Default Account (Seeded):
Email: admin@shop.com
Password: admin123

yaml
Copy code

---

## 🧱 Tech Stack

| Layer | Tech |
|------|------|
| **Frontend** | React + Vite + Tailwind CSS |
| **Backend** | Spring Boot, Spring Security, JWT, JPA/Hibernate |
| **Database** | MySQL 8+ |
| **Build Tools** | npm, Maven |

---

## 🖥️ Project Structure
ElectroShop/
├── backend/ # Spring Boot API
│ └── src/main/java/
│ ├── auth/
│ ├── products/
│ ├── cart/
│ ├── orders/
│ └── admin/
└── frontend/ # React Client
└── src/
├── components/
├── pages/
├── context/
└── api/

yaml
Copy code

---

## 🗄️ Prerequisites
- **Java 17+**
- **Node.js 18+**
- **MySQL running locally**

Create the database:
```sql
CREATE DATABASE ecommerce;
⚙️ Backend Setup
Open:

css
Copy code
backend/src/main/resources/application.properties
Update DB username & password.

Start backend:

bash
Copy code
cd backend
mvn spring-boot:run
📡 API runs at: http://localhost:8080

🎨 Frontend Setup
Create .env in frontend/:

env
Copy code
VITE_API_BASE_URL=http://localhost:8080
Run:

bash
Copy code
cd frontend
npm install
npm run dev
🌍 Frontend runs at: http://localhost:5173

📡 API Endpoints (Quick Reference)
Module	Endpoints
Auth	POST /api/auth/signup, POST /api/auth/login
Products	GET /api/products, GET /api/products/{id}
Cart	GET /api/cart, POST /api/cart/add, DELETE /api/cart/remove/{id}, POST /api/cart/clear
Orders	POST /api/orders/place, GET /api/orders
Admin	POST /api/admin/products, PUT /api/admin/products/{id}, DELETE /api/admin/products/{id}, GET /api/admin/users

🧪 Testing with Postman
Import:

pgsql
Copy code
postman/ElectroShop.postman_collection.json
Set Environment:

ini
Copy code
baseUrl = http://localhost:8080
🔐 Security Notes
Login returns a JWT token

Frontend stores it in localStorage

Every protected request sends:

makefile
Copy code
Authorization: Bearer <token>
<p align="center">✨ Ready to deploy, present and showcase your full-stack skills! ✨</p> ```
