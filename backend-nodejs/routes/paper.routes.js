// views.js
const express = require('express');
const paper_routers = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const authenticateToken = require("../middlewares/middlewares")
// Import Mongoose models – adjust paths as necessary
const Papers = require('../models/paper.model');   // Your provided Papers model 
// Import our custom modules
const { DocumentSearch } = require('../document.search');
const { InterestAmplifier } = require('../interest.amplifier');

// Set up multer for handling file uploads (in memory)
const upload = multer();

// We assume your custom JWT middleware already sets req.user for authenticated requests.

// POST /search
paper_routers.post('/search', authenticateToken,async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const query = req.body.query;
    const docSearch = new DocumentSearch();
    let paperIdList;

    if (query === "recommendation") {
      // Use the user's interests for search.
      paperIdList = await docSearch.search(user.interests);
    } else {
      // Update interests using the query text.
      const ia = new InterestAmplifier(query, user);
      await ia.fromSearch();
      paperIdList = await docSearch.search(query);
    }

    // Fetch papers from the database using the custom "id" field.
    // Assuming the stored paperIds are strings representing the paper.id field.
    const papers = await Papers.find({ id: { $in: paperIdList.map(Number) } });
    res.set('Interests', user.interests);
    res.status(200).json(papers);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /paper
paper_routers.post('/paper',authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const paperId = req.body.id;
    // Query by the custom "id" field, not the default _id.
    const paper = await Papers.findOne({ id: paperId });
    if (!paper) {
      return res.status(404).json({ detail: "Paper not found" });
    }
    
    const combinedText = `${paper.title} ${paper.abstract}`;
    const ia = new InterestAmplifier(combinedText, user);
    await ia.fromPaper();
    res.status(200).json(paper);
  } catch (error) {
    console.error("Paper view error:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /pdf
paper_routers.post('/pdf', upload.single('pdf'), async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }
    
    const dataBuffer = req.file.buffer;
    const data = await pdfParse(dataBuffer);
    // Get the text from the first page (if available)
    let query = data.text.split('\f')[0] || '';
    query = query.trim();
    if (!query) {
      query = "Title not found in text";
    }
    
    const ia = new InterestAmplifier(query, user);
    await ia.fromPdf();
    if (query === "Title not found in text") {
      return res.status(400).json({ error: "Metadata does not contain sufficient information" });
    }
    
    const docSearch = new DocumentSearch();
    const paperIdList = await docSearch.search(query);
    const papers = await Papers.find({ id: { $in: paperIdList.map(Number) } });
    res.status(200).json(papers);
  } catch (error) {
    console.error("PDF view error:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = paper_routers;
