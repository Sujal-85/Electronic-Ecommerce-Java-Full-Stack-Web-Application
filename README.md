## ElectroShop - Full-Stack eCommerce (React + Spring Boot + MySQL)

### Prerequisites
- Java 17, Maven
- Node 18+, npm
- MySQL running locally with a database named `ecommerce`

### Backend Setup
1. Update `backend/src/main/resources/application.properties` with your MySQL credentials.
2. From `backend/` run:
```bash
mvn spring-boot:run
```
The API runs at `http://localhost:8080`.

Admin default user: `admin@shop.com` / `admin123` (seeded).

### Frontend Setup
1. From `frontend/` create a `.env` file:
```bash
VITE_API_BASE_URL=http://localhost:8080
```
2. Install and run:
```bash
npm install
npm run dev
```
The app runs at `http://localhost:5173`.

### API Overview
- Auth: `POST /api/auth/signup`, `POST /api/auth/login`
- Products: `GET /api/products`, `GET /api/products/{id}`; Admin: `POST/PUT/DELETE /api/products`
- Cart: `GET /api/cart`, `POST /api/cart/add`, `DELETE /api/cart/remove/{productId}`, `POST /api/cart/clear`
- Orders: `GET /api/orders`, `POST /api/orders/place`
- Admin: `GET /api/admin/users`, `POST /api/admin/users/{id}/role`

### Testing with Postman
Import `postman/ElectroShop.postman_collection.json`. Set `baseUrl` env to `http://localhost:8080`.

### Notes
- JWT is returned from login/signup; frontend stores it in `localStorage` and attaches via `Authorization: Bearer` header.
- Database schema is auto-managed via `spring.jpa.hibernate.ddl-auto=update`.





