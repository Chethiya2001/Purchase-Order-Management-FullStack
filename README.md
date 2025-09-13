# 📦 Purchase Order Management Application

Welcome to the coding exercise!  
This application is a **Purchase Order Management System** built with **.NET 9 (Web API)**, **Angular**, and **SQL Database (Code First)**.  

It allows procurement staff to **manage purchase orders (POs)** with features like **listing, filtering, sorting, pagination, add/edit/delete**.  

---

## 🚀 Features

### 1. List of Purchase Orders
- Display purchase orders in a **tabular view**.
- Support **filtering** (by supplier, status, or date range).
- Support **sorting** (by PO number, order date, total amount).
- Support **pagination** for large datasets.

### 2. Manage Purchase Orders
- Create new purchase orders.
- Update existing purchase orders.
- Delete purchase orders.

### 3. Purchase Order Fields
- **PO Number** (unique identifier)
- **Description**
- **Supplier Name**
- **Order Date**
- **Delivery Date**
- **Total Amount**
- **Status** (Draft / Approved / Shipped / Completed / Cancelled)

---

## 📌 Assumptions

- **PO Number** must always be unique.  
- **Status** can only be one of: Draft, Approved, Shipped, Completed, or Cancelled.  
- **Total Amount** is always stored and displayed with **two decimal places**.  

### Filtering Assumptions
- Supplier filtering uses an **exact match** (case-insensitive).  
- Status filtering uses the predefined `POStatus` enum values.  
- Date range filtering uses **inclusive range** (`>= startDate` and `<= endDate`).  

### Sorting Assumptions
- PO Number, Order Date, or Total Amount can apply sorting.  
- Sorting defaults to **ascending order** unless explicitly requested as descending.  
- Only one column can be sorted at a time (for simplicity).  

### Pagination Assumptions
- Default page size is 10.  
- The client can change the page size.  

### Performance Assumption
- Filtering, sorting, and pagination are implemented **server-side** to handle large datasets.  

---

## ⚙️ Tech Stack

- **Backend**: .NET 9 Web API  
- **Frontend**: Angular 20+  
- **Database**: MySQL Server (EF Core Code First)  
- **ORM**: Entity Framework Core  

---

## 🛠️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/your-username/purchase-order-management.git
cd Purchase-Order-Management-FullStack
```
### 2. Start Xampp or install

### 2. Start XAMPP / Install
- Install **XAMPP** (if not already installed).  
- Start **Apache** and **MySQL** services.  
- Make sure your MySQL connection string in `appsettings.json` matches your local credentials.
  
Example:
```json
"ConnectionStrings": {
  "DefaultConnection": "server=localhost;database=PurchaseOrderDB;user=root;password=;"
}
```
### 3. Backend 

### 3. Backend Setup

1. Navigate to the backend folder and build the project:

```bash
cd backend
dotnet build
```

2. Run initial Entity Framework migrations to create the database schema

```bash
cd PurchaseOrderManagement.WebApi
dotnet ef migrations add InitialCreate --project ../PurchaseOrderManagement.Infrastructure --startup-project .
dotnet ef database update --project ../PurchaseOrderManagement.Infrastructure --startup-project .

```





