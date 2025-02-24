# Library Management System (LibraryMS)

## 📌 Overview
LibraryMS is a **TypeScript-based** Library Management System designed to handle book issuance, returns, and track pending books efficiently. The system is built using **React, Supabase, and Tailwind CSS**, ensuring a seamless and user-friendly experience.

## ✨ Features
- 📖 **Book Issuance**: Users can issue books and track them easily.
- 🔄 **Book Returns**: Manage book returns with real-time status updates.
- ⏳ **Pending Returns**: Keep track of books that are yet to be returned.
- 🔍 **Search & Filter**: Quickly search for books and filter by status.
- 🛠 **User Authentication**: Secure login and access control with Supabase.
- 🎨 **Modern UI**: Styled with Tailwind CSS for a sleek design.

## 🛠️ Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, React Router
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **State Management**: React Hooks
- **Date Handling**: date-fns
- **Build Tool**: Vite

## 🚀 Getting Started
### 1️⃣ Installation
```sh
# Clone the repository
git clone https://github.com/kshitij162005/LibraryMS.git

# Install dependencies
npm install
```

### 2️⃣ Environment Setup
Create a `.env` file in the root directory and configure Supabase credentials:
```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4bnpncW9yY29lZmxza3libHR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMDM2NDIsImV4cCI6MjA1NTc3OTY0Mn0.vgfJY9rE0Ctidlo3L_W9blZPfcnHFRUhf_8KSyHB2n0
VITE_SUPABASE_URL=https://sxnzgqorcoeflskybltu.supabase.co
```

### 3️⃣ Running the Application
```sh
# Start the development server
npm run dev
```
The application will be available at **http://localhost:5173**.

## 🏗 Build & Deployment
```sh
npm run build  # Build the project
npm run preview  # Preview the build
```

## 📜 Available Scripts
| Command         | Description |
|---------------|-------------|
| `npm run dev` | Starts the development server |

