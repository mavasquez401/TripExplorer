# 🌍 Trip Explorer

Trip Explorer is a full-stack travel planning app that allows users to discover random countries, save them to their favorites, and create personal travel itineraries. Built with **Next.js**, **Tailwind CSS**, **MongoDB (Docker)**, and **NextAuth**, the app supports Google authentication and persistent, user-specific trip management.

---

## ✨ Features

- 🎲 Get a random country with capital, region, and flag
- ⭐ Save countries to your favorites (per user)
- 📝 Add personal **notes/itinerary** for each country
- 🔄 Prevent duplicate favorites
- 🗑 Remove trips from your list
- 🔐 Google sign-in with session-based user control

---

## 🧑‍💻 Tech Stack

| Layer       | Tools & Frameworks                          |
| ----------- | ------------------------------------------- |
| Frontend    | Next.js (App Router), React, Tailwind CSS   |
| Backend/API | Node.js (Next.js API Routes), TypeScript    |
| Auth        | NextAuth.js (Google OAuth)                  |
| Database    | MongoDB (Docker container or Atlas)         |
| Deployment  | Vercel (frontend), Docker (MongoDB locally) |

---

## 🚀 Getting Started

### 🛠️ Prerequisites

- Node.js 18+
- Docker (for local MongoDB)
- Google Cloud Console project with OAuth 2.0 credentials

---

### 📦 Installation

1.  **Clone the repo**

    bash
    git clone https://github.com/yourusername/trip-explorer.git
    cd trip-explorer

2.  **Install dependencies**

    npm install

3.  **Set up your environment variables**

    Create a .env.local file in the root:

    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    NEXTAUTH_SECRET=super-secret-string
    MONGODB_URI=mongodb://localhost:27017/trip-explorer

4.  **Run MongoDB in Docker**

    docker compose up -d

5.  **Start the dev server**

    npm run dev

Folder Structure Highlight
trip-explorer/

├── src/

│ ├── app/ # App Router pages & API routes

│ ├── lib/ # Mongo connection & Auth config

│ ├── styles/ # Tailwind/global styles

│ └── components/ # (Optional) UI components

├── docker-compose.yml # MongoDB container

└── .env.local # Your environment config

### **Created by Manuel Vasquez — inspired by real travel experiences and a desire to help users organize dream trips around the world.**
