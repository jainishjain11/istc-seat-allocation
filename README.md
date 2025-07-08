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

The **ISTC Seat Allocation Portal** is a modern, full-stack web application for managing candidate admissions, seat allocation, and document verification for Indo-Swiss Training Centre. It features a secure admin dashboard, real-time seat matrix, automated PDF allocation letters, and a seamless candidate experience.

---

## 🛠️ Tech Stack

| Technology   | Logo | Description |
|--------------|------|-------------|
| Next.js      | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="24"/> | React-based full-stack framework for SSR, routing, and API integration |
| TypeScript   | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="24"/> | Strongly-typed JavaScript for scalable, maintainable code |
| Node.js      | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="24"/> | Backend runtime for server-side logic and APIs |
| MySQL        | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" width="24"/> | Relational database for secure data storage |
| React        | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="24"/> | UI library for dynamic, component-driven frontend |
| PDFKit       | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/file-type-pdf/file-type-pdf-original.svg" width="24"/> | PDF generation for allocation letters |
| CSS Modules  | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="24"/> | Modular, maintainable CSS styling |
| Docker       | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="24"/> | (Optional) Containerized deployment |

---

## ✨ Features

- **Admin Dashboard**: Manage seat allocation, publish results, and set document verification dates.
- **Automated Seat Allocation**: Fair, reservation-compliant algorithm with real-time updates.
- **Candidate Portal**: Personalized results, PDF allocation letter download, and next-step guidance.
- **PDF Allocation Letters**: Professionally branded, instant generation with ISTC header/footer.
- **Responsive Design**: Works beautifully on desktop and mobile.
- **Secure**: Role-based access, input validation, and protected API endpoints.
- **Export/Import**: Admin can export candidate data in CSV format.
- **Modern UI**: Clean, creative, and user-friendly interface.

---

## 📦 Folder Structure

src/
app/
admin/ # Admin dashboard & management
candidate/ # Candidate result and download pages
api/ # All backend API routes
components/ # Reusable React components
lib/ # Database and utility libraries
public/images/ # Logos and static assets
styles/ # CSS Modules

---

## 📝 Getting Started

1. **Clone the Repository**
```
git clone https://github.com/your-repo/istc-seat-allocation.git
cd istc-seat-allocation
```

2. **Install Dependencies**
```
npm install
```

3. **Configure Environment**
- Copy `.env.example` to `.env` and fill in your DB credentials and config.

4. **Run Database Migrations**
Use your preferred migration tool or run SQL scripts in /migrations

5. **Start the Development Server**
```
npm run dev
```

6. **Access the App**
- Login page : `http://localhost:3000/`
- Admin Dashboard: `http://localhost:3000/admin`
- Candidate Portal: `http://localhost:3000/candidate/[userId]/results`

---

## 📄 Sample Screenshots

<div align="center">
<img src="public/images/LoginPage.png" alt="Login Page" width="340" style="margin: 0 10px 24px 10px; border-radius: 10px; box-shadow: 0 4px 18px #0001;"/>
<img src="public/images/Admin_Dashboard.png" alt="Admin Dashboard" width="340" style="margin: 0 10px 24px 10px; border-radius: 10px; box-shadow: 0 4px 18px #0001;"/>
<img src="public/images/Preference_Stats.png" alt="Preference Stats" width="340" style="margin: 0 10px 24px 10px; border-radius: 10px; box-shadow: 0 4px 18px #0001;"
</div>

---


<div align="center">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="32"/>
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="32"/>
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" width="32"/>
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="32"/>
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="32"/>
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="32"/>
</div>
