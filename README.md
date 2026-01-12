# CiteGeist 
### Your Personal AI-Powered Research Companion

<div align="center">
  <img src="https://raw.githubusercontent.com/Geoff-Robin/CiteGeist/main/Frontend/src/assets/citegeist_logo.png" alt="CiteGeist Logo" width="200" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);" />
  <p align="center">
    <strong>Experience the future of research paper discovery.</strong><br />
    Leveraging advanced NLP and personalized recommendations to find your next breakthrough.
  </p>
</div>

<p align="center">
  <a href="https://citegeist.onrender.com/"><strong>Visit Live Site →</strong></a>
</p>

---

## 🚀 Overview

**CiteGeist** is a state-of-the-art research paper recommendation system designed to streamline the literature review process. By analyzing the semantic content of papers and learning from your interactions, CiteGeist provides highly relevant recommendations without the need for intrusive user tracking.

### Why CiteGeist?
*   **Semantic Intelligence**: Moves beyond simple keyword matching using TF-IDF and Cosine Similarity.
*   **Contextual Personalization**: Automatically adapts to your evolving research interests based on your searches and reading habits.
*   **PDF-to-Paper Discovery**: Simply upload a PDF, and CiteGeist will find related research papers instantly.
*   **Privacy-First**: Recommendations are built on content analysis, keeping your personal data secure.

---

## ✨ Key Features

- 🔍 **Advanced Search**: Semantic search that understands the context of your research queries.
- 🤖 **AI Recommendations**: A dynamic "Recommendation" feed tailored to your unique research profile.
- 📄 **PDF Text Extraction**: Intelligent metadata extraction from uploaded research documents to find similar works.
- 📈 **Interest Amplification**: A proprietary "Interest Amplifier" that boosts relevant keywords in your user profile as you explore.
- ⚡ **Real-time Personalization**: Your feed updates instantly as you interact with papers.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Framework**: [Django](https://www.djangoproject.com/) & [DRF](https://www.django-rest-framework.org/)
- **Authentication**: [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **NLP/ML**: [Scikit-learn](https://scikit-learn.org/), [NLTK](https://www.nltk.org/), [YAKE](https://github.com/LIAAD/yake)
- **PDF Processing**: [PyPDF2](https://pypdf2.readthedocs.io/)

---

## ⚙️ Installation

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (or your preferred DB)

### 2. Backend Setup
```bash
cd Backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

---

## 📂 Project Structure

```bash
CiteGeist/
├── Backend/                # Django REST API
│   ├── api/                # Core logic, ML models, and views
│   ├── Backend/            # Main project configuration
│   └── manage.py
├── Frontend/               # React + Vite application
│   ├── src/
│   │   ├── Pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   └── axios/         # API configuration
│   └── tailwind.config.js
└── README.md
```

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for the research community.
</p>
