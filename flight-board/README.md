
---

### ✅ `client/README.md`

```markdown
# 🧭 FlightBoard Client

Modern React-based UI for displaying and managing flight data in real-time.

![FlightBoard Screenshot](./public/screenshot.png)

---

## 📦 Technologies

- **React + Vite**
- **TypeScript**
- **Tailwind CSS**
- **Redux Toolkit**
- **TanStack React Query**
- **SignalR Client**

---

## 🚀 Getting Started

### ✅ Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)

### 🛠️ Setup

### bash
cd client
npm install
npm run dev


Frontend will be available at: http://localhost:3000

### ⚙️ Features
Real-time updates via SignalR

Server-side filtering by status and destination

Redux-managed UI filters

Optimized data fetching using React Query

Responsive, Tailwind-styled interface

### 🔗 API Connection
Configured to connect to:

ts
Copy
Edit
export const API_BASE_URL = "http://localhost:5106/api";
SignalR hub:

ts
Copy
Edit
const connection = new HubConnectionBuilder()
  .withUrl("http://localhost:5106/flighthub")
📚 Libraries Used
@reduxjs/toolkit

react-redux

@tanstack/react-query

@microsoft/signalr

tailwindcss

vite

date-fns

lucide-react (icons)

### 📂 Project Structure
client/
├── public/
│   └── screenshot.png
├── src/
│   ├── app/
│   │   ├── queryClient.ts
│   │   └── store.ts
│   ├── components/
│   │   └── ui/
│   │       ├── AddFlightModal.tsx
│   │       ├── FlightCard.tsx
│   │       ├── FlightFilters.tsx
│   │       ├── FlightGrid.tsx
│   │       └── Toast.tsx
│   ├── features/
│   │   └── flights/
│   │       ├── flightsUiSlice.ts
│   │       ├── types.ts
│   │       └── useFlights.ts
│   ├── pages/
│   │   └── FlightBoardPage.tsx
│   ├── services/
│   │   └── signalR.ts
│   ├── App.css
│   ├── App.test.tsx
│   ├── App.tsx
│   ├── config.ts
│   ├── index.css
│   ├── index.tsx
│   ├── logo.svg
│   ├── react-app-env.d.ts
│   ├── reportWebVitals.ts
│   └── setupTests.ts
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts

