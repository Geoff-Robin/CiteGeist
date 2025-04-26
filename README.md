# CiteGeist

<div align="center">
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI3GJO08cT7TPyESpj95qMI4aucyjGbt2z8A&s" alt="I am the codegeist" width="200" height="200" />
  <img src="https://miro.medium.com/v2/da:true/resize:fit:499/0*5c0EFFAYszh03b4J.gif" alt="Animated gif" width="200" height="200" />
  <img src="https://i.kym-cdn.com/entries/icons/facebook/000/034/196/cover2.jpg" alt="Meme" width="200" height="200" />
</div>

<h4 align="center">"I am the citegeist" - A friend (Definitely Not Me)</h4>

## [+] Description
CiteGeist is a research paper recommendation system that uses content-based filtering via cosine similarity between vectors created with TF-IDF and saved in MongoDB. We deploy this system on a backend which is accessible through the website CodeGeist.

[Visit CiteGeist](https://citegeist.onrender.com/) (might face request delay due Render's free tier policy that causes the backend to spin down during low activity).

## [+] Installation
1. `cd Backend; pip install -r requirements.txt`
2. `python manage.py runserver`
3. `cd Frontend; npm install`
4. `npm run dev`

## [+] Features
- **Content-Based Filtering**: This method recommends articles by analyzing their content rather than tracking user behavior. It finds relevant articles based on what’s written, ensuring quality recommendations.  
- **Article Ranking**: Articles are ranked based on relevance and quality, with the best ones highlighted. Less relevant articles are still considered but given lower priority.  
- **Text Analysis**: The system scans articles for keywords and context to understand their main topics, ensuring accurate recommendations.  
- **No User Tracking**: CiteGeist focuses entirely on the content itself, not on tracking your reading habits or personal data.
