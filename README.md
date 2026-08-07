# Premium Environmental Network Website

A modern, highly dynamic, and beautifully designed web application built for an environmental organization. Developed with performance, aesthetics, and usability in mind.

**Developed by:** Rizqara Tech Developer

---

## 🚀 Key Features

### 1. Dynamic Headless CMS Integration
The entire frontend of the application is data-driven. Using a lightweight, browser-based `localStorage` architecture, content can be completely modified through the Admin Panel without touching the underlying source code.
- **Dynamic Icons:** Built-in dynamic icon mapping utilizing `lucide-react`.
- **Safe Fallbacks:** The platform safely defaults to built-in content if the database is cleared or uninitialized.

### 2. Comprehensive Admin Dashboard
A fully-featured, secure Admin interface (`/admin`) designed for complete content management. Includes dedicated management views for:
- **Hero Section:** Manage main headlines, subtitles, and background imagery.
- **Who We Are:** Update core organizational focus points.
- **Impact Stats:** Edit numerical statistics representing global impact.
- **Mission & Values:** Dynamically configure mission statements and core values.
- **Research & Knowledge:** Manage research capabilities, descriptions, and tags.
- **Youth Development:** Update youth initiatives and tracking metrics.
- **Campaigns & Projects:** Control featured environmental projects and active campaigns.
- **Partners & Testimonials:** Manage trusted partner logos and user reviews.

### 3. Premium UI & UX Design
Built with modern design aesthetics focusing on user engagement:
- Smooth micro-animations using `framer-motion`.
- Glassmorphism, subtle shadows, and premium styling techniques.
- Fully responsive layouts tailored for all screen sizes.
- Accessible and semantic HTML structure.

---

## 🛠 Tech Stack

- **Frontend Framework:** React (Vite)
- **Routing:** React Router v7
- **Styling:** Tailwind CSS (via Tailwind utility classes and Vanilla CSS overrides)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Database / CMS:** `localStorage` (Mock Headless CMS Architecture)

---

## ⚙️ Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine.

### Installation

1. Clone the repository and navigate to the project folder.
2. Install the necessary dependencies:
   ```bash
   npm i
   ```

### Running the Development Server

Start the local Vite development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

### Production Build

To build the application for deployment (e.g., Namecheap, Vercel, Netlify):
```bash
npm run build
```
This will generate optimized static files in the `dist/` directory.

---

## 📂 Project Structure Overview

- `/src/app/components/home/`: Contains all the frontend dynamic sections (Hero, Mission, Stats, etc.).
- `/src/app/pages/admin/`: Houses the comprehensive Admin Dashboard and its secure routes.
- `/src/app/pages/admin/sections/`: Contains the specific CRUD views for each aspect of the website's content.

---

*Original design inspiration available at [Figma Link](https://www.figma.com/design/TIElCBCpvVxAPwAPbeckTD/Premium-Environmental-Network-Website).*