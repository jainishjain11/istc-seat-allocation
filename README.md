
<div align="center"> <img src="https://raw.githubusercontent.com/github/explore/main/topics/institutional/institutional.png" alt="ISTC Logo" width="100" /> <h1 align="center">ISTC Seat Allocation Management System</h1> <p align="center"> <b>Automating fair, transparent, and efficient seat allocation for ISTC, CSIR</b><br /> <sub> Built with a robust stack: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Next.js" width="30"/>&nbsp; <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" width="30"/>&nbsp; <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="MySQL" width="30"/>&nbsp; <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" width="30"/>&nbsp; <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" alt="TailwindCSS" width="30"/> </sub> </p>
![badge](https://img.shields.io/badge/Status-Production-success?](https://img.shields.io/badge/Security-Admin%20IP%20Locking-blue?style=for-the-badgeields.io/badge/License-Apache%202.0-orange?style=for 🎯 Project Overview


The **ISTC Seat Allocation Management System** is a state-of-the-art web application for managing admissions and automated seat allocation at ISTC, CSIR.  
Designed for **efficiency, fairness, and security**, it supports two user profiles:
- 🛡️ **Admin**: Controls seat allocation, manages system state, and can lock access via IP.
- 👤 **Candidate**: Easily registers, submits preferences, sees status & results.

## ✨ Features & Highlights

- 🎓 **Student Registration**: Seamless, guided experience for candidates.
- 🗂 **Preference Management**: Candidates rank their course preferences.
- 🧑‍💼 **Admin Dashboard**: Visual stats, allocation, user management, and CSV/PDF export.
- 📑 **Activity Logs**: Track all candidate actions with downloadable PDF logs.
- 🏢 **Robust Authentication**: Secure, role-based access using DOB/password for candidates and locked IP for admin.
- 🪪 **Result Portal**: Instant result publication and result status handling.
- 🔒 **IP Locking for Admin**: Restrict admin portal access to specific IP address.
- ☁️ **Production-Ready**: Optimized for deployment on Vercel and similar PaaS.

## 🚀 Tech Stack
<p align="center"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original-wordmark.svg" alt="Next.js" width="55"/> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original-wordmark.svg" alt="React" width="55"/> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-plain.svg" alt="TypeScript" width="45"/> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original-wordmark.svg" alt="MySQL" width="60"/> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" alt="Tailwind" width="55"/> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original-wordmark.svg" alt="Docker" width="60"/> </p>


## ⚙️ Installation & Setup

```bash
# Clone the repo
git clone https://github.com/[your-username]/istc-seat-allocation.git
cd istc-seat-allocation

# Install dependencies
npm install

# Configure your .env.local
cp .env.example .env.local
# Fill in your DB and secret values

# Prepare the database
# Import ./schema.sql to your MySQL server

# Start the dev server
npm run dev
```

## 🛡️ Security Features

- **Admin IP Lock:** Admin portal access is optional-restricted to a single IP address set interactively by the admin.
- **Activity Logs:** All critical candidate actions (login, registration, edits) are time-stamped and viewable/exportable by admin.
- **Role-Based:** Admin and candidate experiences are fully separated.

## 📦 Folder Structure

```
├── app/
│   ├── admin/         # Admin dashboard and controls
│   └── candidate/     # Candidate registration, dashboard, result
├── lib/               # DB connection, utilities, log helpers
├── public/            # Static assets (logo, favicon)
├── styles/            # Tailwind/global CSS
├── .env.local         # Environment and secret keys
├── middleware.ts      # Middleware for IP locking, etc.
```

## 🙌 Acknowledgements

- **Next.js** – SSR + powerful routing
- **Tailwind CSS** – Rapid, beautiful UI
- **MySQL** – Production-proven relational DB
- **PDFKit** – PDF log export
- **Vercel** – Effortless hosting

## 📧 Contact

- Project by Jainish Jain, Paramveer Singh | CSIR-ISTC



  


**Give a ⭐ on GitHub if you find this project useful!**

**_“Modern admissions. Efficient. Secure. ISTC Seat Allocation.”_**

*Add or replace screenshots, email, and repo URLs with your own!*
