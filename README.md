# 🗂️ Task Manager API

**Task Manager API** is a full-stack task management web application built with **Node.js**, **Express**, **React**, and **MongoDB**. It includes secure user authentication, a password reset system via email, and a dynamic user dashboard for managing tasks and profile settings.

---

## 📸 Preview

![image](https://github.com/user-attachments/assets/781863cf-aa59-478e-ac26-9e9450e7ac5b)

---

## 🚀 Features

- 🔐 **Secure Authentication**: JWT-based login system with bcrypt password hashing.
- 📩 **Forgot Password**: Automatically sends a password reset email.
- ✅ **Task Management**: Create, update, complete, and delete tasks (CRUD).
- ⚙️ **User Settings**: Change name, email, and password through the dashboard.

---

## 🛠️ Tech Stack

| Layer        | Tech                        |
|--------------|-----------------------------|
| **Frontend** | React.js, Axios             |
| **Backend**  | Node.js, Express            |
| **Database** | MongoDB (via Mongoose)      |
| **Auth**     | JWT, Bcrypt                 |
| **Email**    | ???  |

---

## 📦 Installation

### 🧰 Pre-requisites

- Node.js & npm
- MongoDB
- A Gmail account for Nodemailer (or other SMTP)

### 🔧 Backend Setup

```bash
git clone https://github.com/raphaeld0/task-manager-nodejs
cd task-manager-api/backend
npm install
