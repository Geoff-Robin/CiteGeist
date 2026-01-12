# CiteGeist Backend 🐍

The engine behind CiteGeist, powered by Django and advanced NLP.

## 🚀 Core Functionality
- **Personalized Recommendations**: Content-based filtering using TF-IDF and Cosine Similarity.
- **Semantic Search**: Context-aware searching across the paper database.
- **Text Analysis**: Intelligent keyword extraction from abstracts and PDFs using YAKE.
- **Secure Authentication**: JWT-based auth with refresh token rotation and blacklisting.
- **RESTful API**: Clean and documented endpoints for the frontend.

## 🛠️ Tech Stack
- **Django 5** & **Django REST Framework**
- **SimpleJWT** for secure user sessions.
- **PostgreSQL** (via `dj-database-url`).
- **Scikit-learn** for vectorization and similarity calculations.
- **YAKE** for automatic keyword extraction.
- **PyPDF2** for parsing uploaded research papers.

## 📦 Setup

### Prerequisites
- Python 3.10+
- Virtual environment (recommended)

### Installation
1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure Environment Variables:
   Create a `.env` file with the following:
   ```env
   SECRET_KEY=your_secret_key
   DEBUG=True
   DATABASE_URL=postgres://user:password@localhost:5432/citegeist
   ```

4. Run Migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the server:
   ```bash
   python manage.py runserver
   ```

## 🧠 Recommendation Engine Details
The `api/recommender.py` module handles the core logic:
- `DocumentSearch`: Manages TF-IDF vectorization and cosine similarity scoring. Vectors are cached in `doc_vectors.joblib` for performance.
- `InterestAmplifier`: Dynamically updates user interests based on their platform behavior (searches, PDF uploads, paper views).
