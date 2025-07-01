# ISTC Seat Allocation Management System 🚀

![Node.js](https://img.shields.io/badge/Node.js-%3E=18-blue.svg)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange.svg)
![Production Ready](https://img.shields.io/badge/Status-Production-brightgreen.svg)


---

## 📚 Overview

**ISTC Seat Allocation Management System** is a full-stack web application for managing candidate registrations, seat allocation, and administrative operations for ISTC.  
It features a robust admin portal, candidate activity logs, backup & restore, and a secure, transparent allocation algorithm.

---

## ✨ Features

- 👥 **User Management:** Bulk upload candidates via CSV, manage users, and monitor registration status.
- 📝 **Candidate Registration:** Secure, form-based registration with validation and activity logging.
- 🛡️ **Admin Dashboard:** Real-time stats, quick actions, and system status at a glance.
- 🎯 **Seat Allocation Algorithm:** Automated, reservation-rule-based allocation with category-wise seat split.
- 🔒 **Registration Lock:** Instantly open/close candidate registration from the admin panel.
- 📊 **Statistics & Analytics:** Visualize allocation, registration, and system trends.
- 🗂️ **Activity Logs:** Track all candidate/admin actions with timestamps and exportable PDF logs.
- 💾 **Backup & Restore:** One-click full system backup and restore for disaster recovery.
- ⚡ **System Reset:** Secure, admin-authenticated system reset for new cycles.
- 🛠️ **Configurable Reservation Rules:** Update category reservation percentages anytime.

---

## 🚦 Tech Stack

| Frontend      | Backend     | Database | Other         |
|:-------------:|:-----------:|:--------:|:-------------:|
| Next.js 14    | Node.js 18+ | MySQL 8  | Tailwind CSS  |
| React 18      | API Routes  |          | jsPDF         |
| TypeScript    |             |          | Docker Ready  |


<p align="center"> <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" /> <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" /> <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" /> <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" /> <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" /> <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" /> <img src="https://img.shields.io/badge/jsPDF-FFB300?style=for-the-badge&logo=javascript&logoColor=black" /> </p>

---

## 🏁 Quick Start

### 1. **Clone the repository**

```bash
git clone https://github.com/yourusername/istc-seat-allocation.git
cd istc-seat-allocation
```


### 2. **Install dependencies**
```bash
npm install
```


### 3. **Configure your environment**
- Copy `.env.example` to `.env.local` and set your MySQL credentials.

### 4. **Set up the database**
- Import the provided SQL schema:
```bash
mysql -u root -p istc_seat_allocation < schema.sql
```


### 5. **Run the development server**

```bash
npm run dev
```


- Visit [http://localhost:3000](http://localhost:3000) to use the app.

---

## 🔑 Admin Features

- **Dashboard:** Real-time stats, system last reset time, and quick actions.
- **Lock/Unlock Registration:** Instantly open or close candidate registration.
- **User Management:** Upload users via CSV, view, and manage all candidates.
- **Seat Allocation:** Run allocation algorithm, publish results, and view allocation status.
- **Reservation Rules:** Update category-wise seat reservation percentages.
- **System Settings:** Reset system, backup, and restore data.
- **Activity Logs:** Review all user/admin activities and export logs as PDF.

---

## 🖥️ Screenshots

> _Add screenshots of your dashboard, allocation page, and activity logs here for best presentation!_

---

---

## ⚙️ Configuration

- **Environment variables:**  
  See `.env.example` for all required variables (MySQL credentials, JWT secret, etc).

---

## 🛡️ Security

- Passwords stored securely (hashing recommended in production).
- Admin-only routes protected.
- All sensitive actions require authentication.

---

## 🧑‍💻 Contribution

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [MySQL](https://www.mysql.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [jsPDF](https://github.com/parallax/jsPDF)
- All contributors and testers!

---

## 🚀 Project Status

![Production Ready](https://img.shields.io/badge/Status-Production-brightgreen)

_ISTC Seat Allocation Management System is actively maintained and ready for real-world use._

---

> Made with ❤️ for ISTC,CSIO by Jainish Jain, Paramveer Singh
> jainishjain.1105@gmail.com, param15.veer.singh@gmail.com
