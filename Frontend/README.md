# CiteGeist Frontend ⚛️

The user interface for CiteGeist, built with modern web technologies for a premium research experience.

## 🚀 Features
- **Responsive Dashboard**: Optimized for both desktop and mobile viewing.
- **Interactive Search**: Real-time feedback and semantic paper discovery.
- **PDF Upload Interface**: Simple drag-and-drop or file selection for PDF analysis.
- **Personalized Recommendations**: A dedicated feed tailored to user interests.
- **Shadcn UI Integration**: Sleek, accessible, and customizable components.

## 🛠️ Tech Stack
- **React 18** + **Vite**
- **Tailwind CSS** for styling.
- **Framer Motion** for smooth transitions and animations.
- **Axios** for API communication.
- **React Router** for seamless navigation.

## 📦 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Create a `.env` file (if needed) to point to your backend:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📂 Structure
- `src/components`: Generic UI components (Buttons, Inputs, etc.) and complex components (NavBar, Cards).
- `src/Pages`: Top-level page components (Home, Search, ResearchPaper).
- `src/axios`: Centralized Axios instance with interceptors for auth.
- `src/assets`: Static assets like logos and icons.
