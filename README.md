<div align="center">

# 🛍️ ShopHub

### E-Commerce & Order Management System

*A full-stack marketplace connecting customers with trusted traders.*

</div>

<div align="center">
 <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=800&color=2563EB&center=true&vCenter=true&width=700&height=50&lines=Full-stack+E-Commerce+Platform;Alibaba-inspired+B2C+Marketplace;Spring+Boot+%2B+React+%2B+MySQL" alt="Typing" />
</div>

<div align="center">
 <img src="https://skillicons.dev/icons?i=java,spring,mysql,react,vite,tailwind,js,git,github&theme=dark&perline=10" alt="Tech" />
</div>

<br />

<div align="center">

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

## 📌 What is ShopHub?

**ShopHub** is a modern, production-grade e-commerce platform built with **Spring Boot** and **React**. It follows the **Alibaba-style B2C marketplace** model, where independent traders list products and customers browse, order, and pay — all within a single unified platform.

### Three Pillars

- 🏪 **Multi-vendor support** — every trader operates an independent storefront
- **End-to-end order lifecycle** — cart → checkout → payment → shipping → delivery
- 🔒 **Enterprise-grade security** — JWT, BCrypt, role-based access, per-resource ownership

---

## ✨ Features

### 🔒 Authentication & Authorization

- 🔐 **Role-based access** — `CUSTOMER` and `TRADER` with separate dashboards
- **JWT authentication** — stateless, industry-standard tokens
- 🔒 **BCrypt password hashing** — 10-round salting
- ✅ **Email uniqueness** — case-insensitive, race-safe
- **Persistent sessions** — tokens survive refresh

### 👤 Customer Features

- **Browse by category** — Electronics, Clothing, Books, Home & Kitchen, Sports
- **Discover traders** — visit individual storefronts
- **Product detail** — images, colors, stock indicators
- 🛍️ **Multi-step checkout** — shipping → payment → review
- 📋 **Order history** — track every stage
- **Cart drawer** — slide-in with real-time totals

### 🏪 Trader Features

- **Product management** — add, edit, delete with image upload
- **Multi-step wizard** — info → pricing → photo → options → review
- **Revenue dashboard** — total revenue, pending orders, top products
- **Incoming orders** — view, ship, deliver, or cancel
- **Stock tracking** — auto-decrement, restore on cancel
- 🔒 **Per-trader isolation** — traders only edit their own products

### 🎯 User Experience

- 🌗 **Dark / light mode** — persistent toggle
- ✨ **Floating label inputs** — Material Design
- **Animated success modals** — SVG tick + confetti
- **Framer Motion transitions**
- 📱 **Responsive design** — mobile-first
- **Toast notifications** — real-time feedback

---

## 🏛️ Architecture


---

## ⚙️ Tech Stack

<div align="center">
 <img src="https://skillicons.dev/icons?i=java,spring,mysql,maven,react,vite,tailwind,js,git,github&theme=dark" alt="Tech stack" />
</div>

| Layer | Technology | Version |
| :--- | :--- | :--- |
| **Backend** | Spring Boot | 3.2.5 |
| **Backend** | Spring Security | 6.2.4 |
| **Backend** | Spring Data JPA | 3.2.5 |
| **Backend** | Hibernate | 6.4.4 |
| **Backend** | JJWT | 0.12.5 |
| **Backend** | Java | 17 LTS |
| **Frontend** | React | 19 |
| **Frontend** | Vite | 5.4 |
| **Frontend** | Tailwind CSS | 3.4 |
| **Frontend** | Framer Motion | 11.x |
| **Database** | MySQL | 8.0 |

---

## 🚀 Getting Started

### Prerequisites

- **Java 17** — [Temurin](https://adoptium.net)
- **Maven 3.9+**
- **Node.js 20+**
- **MySQL 8.0**

### Setup

```bash
git clone git@github.com:eddy-hash/Ecommerce.git
cd Ecommerce

# Backend
cd Backend
mvn spring-boot:run

# Frontend (new terminal)
cd Frontend
npm install
npm run dev