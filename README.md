# Inventory Management System

A **Full-Stack Inventory Management System** built with **Next.js (TypeScript)**, **Node.js + Express**, and **MongoDB Atlas**, featuring a responsive UI with **Tailwind CSS**.  

Users can manage products, import/export CSVs, view inventory history, and perform CRUD operations with authentication.

---

## 🚀 Features

### Frontend
- Responsive **Next.js + Tailwind CSS** UI
- Product **search and category filtering**
- **Add/Edit/Delete** products directly
- **CSV Import & Export**
- **Inventory history sidebar**
- Authentication: **Sign-up & Login**
- **Pagination** for product lists

### Backend
- **Node.js + Express** RESTful API
- **MongoDB Atlas** for storage
- **JWT-based authentication**
- **CSV import/export** functionality
- **Inventory history tracking**
- Validations for product fields (unique name, stock numeric, status enum)

---


---

## ⚡ Technologies Used

- **Frontend:** Next.js, TypeScript, Tailwind CSS, React Hooks  
- **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose  
- **Authentication:** JWT  
- **File Handling:** Multer (for CSV import)  
- **Deployment:** Netlify (Frontend), Render/Heroku (Backend)

---

## 🔧 Installation & Setup

### Backend

1. Clone the repository:  

```bash
git clone <your-repo-url>
cd backend

npm install

MONGO_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<your-jwt-secret>
PORT=4000

mkdir uploads

npm run dev
# or
node server.js

############################################## FRONTEND###############################################
cd frontend
npm install
npm run dev
http://localhost:3000

API Endpoints
Auth

POST /api/auth/register → Sign up

POST /api/auth/login → Login

Products

GET /api/products → List products

POST /api/products/add → Add new product

PUT /api/products/:id → Update product

DELETE /api/products/:id → Delete product

POST /api/products/import → Import CSV

GET /api/products/export → Export CSV

GET /api/products/:id/history → Get inventory history

⚙️ Notes

Protected routes require JWT token in Authorization header.

CSV import expects column headers: name, unit, category, brand, stock, status.

Images are optional / removed in this version.

Author

Shifa Tazeen Shaikh

Full-Stack Developer | MERN + Next.js | Tailwind CSS