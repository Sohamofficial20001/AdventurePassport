# 🎟️ SAP Adventure Passport

SAP Adventure Passport is a **gamified digital experience platform** built to engage users with SAP concepts through interactive challenges, simulations, and explorations — all unified under a **digital passport system**.

The platform is designed for **events, learning programs, workshops, and demonstrations**, offering a balance between **education, engagement, and fun**.

---

## 🌟 Overview

Users receive a **digital passport** where they:
- Explore interactive experiences
- Complete challenges
- Earn stamps based on participation and performance

Each completed activity updates the passport in real time, creating a memorable and trackable journey through SAP concepts.

---

## 🛂 Digital Passport System

- Centralized progress tracking
- Stamp-based completion model
- Clear distinction between:
  - **Participation**
  - **Successful completion**
- Responsive and mobile-friendly UI inspired by real passports

---

## 🧩 Platform Highlights

- Modular, game-agnostic architecture  
- Unified completion and stamping logic  
- Supports skill-based and participation-based experiences  
- Designed for touch devices and kiosks  
- Easily extensible with new experiences  

---

## 🏗️ Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS

### Backend
- Supabase
  - Authentication
  - Secure data storage
  - Session persistence

---

## 🔐 Authentication & Persistence

- Email-based authentication
- Session persistence across reloads
- Progress stored securely and restored automatically
- Case-insensitive user handling

---

## 📊 Completion Model

Each activity reports completion using a simple contract:

- **WON** – Successful completion
- **PARTICIPATED** – Activity attempted
- **NONE** – Not played

This allows flexible experiences without breaking overall flow.

---

## 🛠️ Installation

```bash
git clone https://github.com/sohamofficial20001/AdventurePassport.git
cd AdventurePassport
npm install
npm run dev
