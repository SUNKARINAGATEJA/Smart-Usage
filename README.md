# Smart Usage AI 💰

**AI-Powered Personal Expense & Budget Management System**

SpendWise AI is a full-stack personal finance management application designed to help users track their income and expenses, manage monthly budgets, understand spending patterns, and automatically categorize transactions using machine learning.

The goal of the project is to combine **software engineering, data management, visualization, and machine learning** into a practical personal-finance application.

---

## 🚀 Features

### 🔐 User Authentication

* User registration and login
* Secure authentication
* User-specific financial data
* Protected application routes

### 💳 Expense & Income Management

* Add income and expenses
* Edit existing transactions
* Delete transactions
* Categorize transactions
* Search and filter transactions
* Track transaction dates and descriptions

### 📊 Financial Dashboard

* View total income
* View total expenses
* Track current balance
* Monitor spending by category
* Visualize financial activity using charts

### 🎯 Budget Management

* Create monthly budgets
* Set spending limits by category
* Track budget utilization
* Monitor remaining budget
* Identify categories approaching their limits

### 🤖 AI-Powered Expense Categorization

SpendWise AI uses machine learning to automatically categorize transactions.

For example:

```text
"₹450 - Swiggy"      → Food
"₹1,200 - Amazon"    → Shopping
"₹80 - Uber"         → Transportation
"₹500 - Netflix"     → Entertainment
```

This reduces manual categorization and makes expense tracking easier.

### 📁 Transaction Import

* Import transaction data from CSV files
* Process and categorize imported transactions
* Review imported financial records

### 🔎 Search & Filtering

Users can filter transactions based on:

* Category
* Date
* Transaction type
* Amount
* Search keywords

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* HTML
* CSS
* Tailwind CSS

### Backend

* Node.js
* Express.js
* TypeScript
* REST APIs

### Database

* PostgreSQL

### Machine Learning

* Python
* Scikit-learn
* Pandas
* NumPy

### Development Tools

* Git
* GitHub
* VS Code

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │ React + TypeScript  │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │       Backend       │
                    │ Node.js + Express   │
                    └───────┬─────┬───────┘
                            │     │
                 ┌──────────┘     └──────────┐
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │   PostgreSQL    │        │  ML Categorizer │
        │    Database     │        │ Python +        │
        │                 │        │ Scikit-learn   │
        └─────────────────┘        └─────────────────┘
```

---

## 📂 Project Structure

```text
SpendWise-AI/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.tsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── server.ts
│   │
│   └── package.json
│
├── ml/
│   ├── data/
│   ├── models/
│   ├── train.py
│   └── predict.py
│
├── README.md
└── .gitignore
```

---

## ⚙️ How It Works

### 1. User adds a transaction

```text
Amount: ₹450
Description: Swiggy
Type: Expense
```

### 2. Transaction is sent to the backend

The Express.js API validates the request and stores the transaction.

### 3. ML model analyzes the description

The machine learning component processes the transaction description and predicts its category.

```text
Swiggy → Food
```

### 4. Data is stored

The transaction and predicted category are stored in PostgreSQL.

### 5. Dashboard updates

The user can immediately see the transaction and its effect on:

* Total expenses
* Remaining budget
* Category spending
* Overall balance

---

## 🤖 Machine Learning

The ML component is designed to classify transactions based on their descriptions.

### Example

| Transaction      | Predicted Category |
| ---------------- | ------------------ |
| Swiggy           | Food               |
| Amazon           | Shopping           |
| Uber             | Transportation     |
| Netflix          | Entertainment      |
| Electricity Bill | Utilities          |

The project can use text-based feature extraction and a classification algorithm from Scikit-learn.

Possible pipeline:

```text
Transaction Description
          ↓
Text Preprocessing
          ↓
Feature Extraction
          ↓
ML Classification Model
          ↓
Predicted Category
```

---

## 📊 Dashboard

The dashboard provides an overview of the user's financial activity.

Example metrics:

```text
Total Income       ₹30,000
Total Expenses     ₹18,500
Current Balance    ₹11,500
Monthly Budget     ₹20,000
```

Users can also view spending patterns through charts and category breakdowns.

---

## 🔒 Security

The application follows basic security practices including:

* Authentication
* Protected API routes
* Input validation
* Secure password handling
* User-specific data access
* Environment variables for sensitive configuration
* Database query validation

Sensitive credentials should never be committed to GitHub.

---

## 🧪 Testing

The project includes testing for important application functionality such as:

* Authentication
* Transaction creation
* Transaction updates
* Transaction deletion
* Budget calculations
* API validation
* ML categorization

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* Python 3
* PostgreSQL
* Git

---

### Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/SpendWise-AI.git

cd SpendWise-AI
```

---

### Install Frontend Dependencies

```bash
cd client
npm install
```

---

### Install Backend Dependencies

```bash
cd ../server
npm install
```

---

### Install Python Dependencies

```bash
cd ../ml

pip install -r requirements.txt
```

---

## 🔑 Environment Variables

Create a `.env` file in the backend directory.

Example:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
ML_SERVICE_URL=your_ml_service_url
```

**Never commit your `.env` file to GitHub.**

---

## ▶️ Running the Application

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The application will then be available through the local development URL shown by Vite.

---

## 📈 Future Improvements

Planned improvements include:

* AI-generated financial insights
* Spending predictions
* Recurring transaction detection
* Financial goal tracking
* Personalized saving recommendations
* Advanced spending analytics
* Mobile application
* Cloud deployment
* Improved ML categorization
* Export financial reports as PDF

---

## 🎯 Project Goals

SpendWise AI was built to demonstrate practical experience with:

* Full-stack application development
* REST API development
* Database design
* Authentication
* Machine learning
* Data visualization
* Software architecture
* Git and GitHub
* AI-assisted application development

---

## 👨‍💻 Author

**Your Name**

B.Tech — Artificial Intelligence & Machine Learning

GitHub: `https://github.com/YOUR_USERNAME`

---

## 📄 License

This project is created for educational and portfolio purposes.
