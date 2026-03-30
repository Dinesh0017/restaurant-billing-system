# 🍽️ Restaurant Billing & Inventory Management System

A modern full-stack **Restaurant Billing & Inventory Management System** built using **Next.js**, **TypeScript**, **PostgreSQL**, and **Prisma**.

This system is designed to manage restaurant inventory, categories, billing, customer details, bill history, analytics, and email bill sending in one clean and practical application.

---

## 📌 Overview

This project helps restaurants manage their day-to-day billing and inventory operations digitally.  
It includes a modern POS interface, stock tracking, customer billing, analytics, and email-based bill sharing.

This project is suitable for:
- 🎓 Academic projects  
- 💼 Portfolio showcase  
- 🍔 Small restaurant management systems  
- 🚀 Full-stack learning projects  

---

## 🚀 Features

### 🗂️ Category Management
- Add new categories  
- Delete categories  
- Organize items by category  

### 📦 Inventory Management
- Add items with:
  - Name  
  - Price  
  - Stock  
  - Category  
  - Image  
- Update / delete items  
- Stock status indicators:
  - 🟢 In Stock  
  - 🟡 Low Stock  
  - 🔴 Out of Stock  

### 💳 POS / Billing System
- Category-based filtering  
- Add items to cart  
- Quantity control  
- Prevent over-ordering  
- Auto total calculation  
- Instant bill generation  

### 👤 Customer Details
- Save customer info:
  - Name  
  - Email  
  - Phone  

### 🧾 Bill Management
- Store all bills  
- View bill history  
- Track purchased items  

### 🔄 Automatic Stock Update
- Stock reduces automatically after billing  

### 📧 Email Bill Sending
- Send bills to customers via email  

### 📊 Analytics Dashboard
- View sales by:
  - Today  
  - Last 7 Days  
  - Weekly  
  - Monthly  
  - Yearly  
  - Custom Range  
- Charts:
  - Pie Chart  
  - Line Graph  

---

## 🛠️ Tech Stack

### Frontend
- Next.js  
- React  
- TypeScript  
- Tailwind CSS  

### Backend
- Next.js API Routes  

### Database
- PostgreSQL  
- Prisma ORM  

### Other Tools
- Nodemailer (Email)  
- Chart libraries  
- Image upload system  

---

## 📸 Screenshots

> Add screenshots inside a folder called `screenshots`

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Category Management
![Category](./screenshots/category-management.png)

### Inventory
![Inventory](./screenshots/inventory-management.png)

### POS Billing
![POS](./screenshots/pos-billing.png)

### Bill History
![Bills](./screenshots/bill-history.png)

### Analytics
![Analytics](./screenshots/analytics-dashboard.png)

---

## 🔄 System Workflow

1. Create categories  
2. Add inventory items  
3. Select items in POS  
4. Enter customer details  
5. Generate bill  
6. Stock updates automatically  
7. Save bill history  
8. Send email receipt  
9. View analytics  

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the project root and add:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/restaurant_billing"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Setup Database
Make sure PostgreSQL is installed and running, then create the database:

```sql
CREATE DATABASE restaurant_billing;
```

### 5. Run Prisma Migration
```bash
npx prisma migrate dev
```

### 6. Generate Prisma Client
```bash
npx prisma generate
```

### 7. Start the Development Server
```bash
npm run dev
```

### 8. Open the Application
Open this in your browser:

```bash
http://localhost:3000
```
