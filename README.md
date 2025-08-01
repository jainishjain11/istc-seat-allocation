<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Next.js" width="70" style="margin: 0 10px;"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" width="70" style="margin: 0 10px;"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="MySQL" width="70" style="margin: 0 10px;"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width="70" style="margin: 0 10px;"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" width="70" style="margin: 0 10px;"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" width="70" style="margin: 0 10px;"/>
</div>

<h1 align="center">ISTC Seat Allocation Portal</h1>

<p align="center">
  <b>Modern, Secure, and Automated Seat Allocation System for ISTC Admissions</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-13+-000?logo=next.js&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-4+-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/MySQL-8+-4479A1?logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white" alt="React"/>
</p>

---

## 🚀 Overview

The **ISTC Seat Allocation Portal** is a full-stack web application designed to manage online seat allocation, admission tracking, and document verification processes for the **Indo-Swiss Training Centre (ISTC)**.

It supports admins and candidates with real-time seat matrix management, automated allocation, document uploads, and secure PDF allocation letters.

---

## 🛠️ Tech Stack

## 🛠️ Tech Stack

| Technology   | Logo                                                                 | Description                                                             |
|--------------|----------------------------------------------------------------------|-------------------------------------------------------------------------|
| **Next.js**  | ![Next.js](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg) | React-based full-stack framework for SSR, routing, and API integration |
| **TypeScript** | ![TypeScript](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg) | Strongly-typed JavaScript for scalable, maintainable code              |
| **Node.js**  | ![Node.js](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg) | Backend runtime for server-side logic and APIs                         |
| **MySQL**    | ![MySQL](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg) | Relational database for secure data storage                            |
| **React**    | ![React](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg) | UI library for dynamic, component-driven frontend                      |
| **PDFKit**   | 📄 | PDF generation for allocation letters                                  |
| **CSS Modules** | ![CSS](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg) | Modular, maintainable CSS styling                                      |
| **Docker**   | ![Docker](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg) | Containerized deployment                                               |


---

## ✨ Features

- 🔐 **Admin Dashboard** – Manage allocations, preferences, verification, and export CSVs.
- 🧠 **Automated Seat Allocation** – Fair & reservation-based algorithm.
- 🧑‍🎓 **Candidate Portal** – View results, download allocation letters, see next steps.
- 📄 **PDF Generation** – Branded, auto-generated allocation letters with PDFKit.
- 📱 **Responsive Design** – Fully functional on desktop and mobile.
- 🔒 **Role-Based Access** – Secure APIs and user-level restrictions.
- ⬇️ **CSV Import/Export** – Admin-friendly data portability.
- 💡 **Modern UI/UX** – Clean, fast, and intuitive interface.

---

## 📝 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/istc-seat-allocation.git
cd istc-seat-allocation
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Configure Environment
Copy the example file:
```bash
cp .env.example .env
```
Fill in the required MySQL credentials and config in .env

### 4. SetUp Database
Use SQL scripts in migrations/ or your migration tool of choice.

### 5. Start the Development Server
```bash
npm run dev
```

### 6. Access the Application
Login Page: http://localhost:3000/

Admin Panel: http://localhost:3000/admin

Candidate Results: http://localhost:3000/candidate/[userId]/results

## 📸 Sample Screenshots
<div align="center"> <img src="public/images/LoginPage.png" alt="Login Page" width="340" style="margin: 10px; border-radius: 10px; box-shadow: 0 4px 18px #0001;"/> <img src="public/images/Admin_Dashboard.png" alt="Admin Dashboard" width="340" style="margin: 10px; border-radius: 10px; box-shadow: 0 4px 18px #0001;"/> <img src="public/images/Preference_Stats.png" alt="Preference Stats" width="340" style="margin: 10px; border-radius: 10px; box-shadow: 0 4px 18px #0001;"/> <img src="public/images/Candidate_Dashboard.png" alt="Candidate Dashboard" width="340" style="margin: 10px; border-radius: 10px; box-shadow: 0 4px 18px #0001;"/> </div>

<div align="center"> Built using Next.js, TypeScript, and MySQL </div>

This is a repo made for making the ISTC Official Website.

