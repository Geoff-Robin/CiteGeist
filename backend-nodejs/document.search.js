// documentSearch.js
const fs = require('fs');
const path = require('path');
const Papers = require('./models/paper.model'); // using your provided Papers model

// Helper: simple tokenization (splitting on non-word characters)
function tokenize(text) {
  return String(text)
    .toLowerCase()
    .match(/\b\w+\b/g) || [];
}

// Helper: cosine similarity between two arrays
function cosineSimilarity(vecA, vecB) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

class DocumentSearch {
  constructor(vectorsPath = 'doc_vectors.json') {
    this.vectorsPath = path.resolve(vectorsPath);
    this.vocabulary = {}; // term -> index
    this.idf = [];        // inverse document frequency vector
    this.docVectors = []; // list of TF-IDF vectors (each as an array)
    this.paperIds = [];   // list of paper ids (using the custom "id" field)
  }

  preprocess(text) {
    return String(text).toLowerCase();
  }

  async loadOrCreateVectors() {
    if (fs.existsSync(this.vectorsPath)) {
      const savedData = JSON.parse(fs.readFileSync(this.vectorsPath, 'utf8'));
      this.vocabulary = savedData.vocabulary;
      this.idf = savedData.idf;
      this.docVectors = savedData.docVectors;
      this.paperIds = savedData.paperIds;
    } else {
      await this.computeAndSaveVectors();
    }
  }

  async computeAndSaveVectors() {
    // Fetch all papers from the database
    const papers = await Papers.find({}, { id: 1, title: 1, abstract: 1, authors: 1 });
    if (!papers || papers.length === 0) {
      throw new Error("No papers found in database");
    }

    const combinedDocs = [];
    const paperIds = [];

    // Build combined text for each paper (using title, abstract, and authors)
    papers.forEach(paper => {
      const combinedText = `${paper.title} ${paper.abstract} ${paper.authors || ''}`;
      combinedDocs.push(combinedText);
      // Convert paper.id to string for consistency
      paperIds.push(String(paper.id));
    });

    // Build vocabulary from all documents
    const docTokens = combinedDocs.map(doc => tokenize(doc));
    const vocabSet = new Set();
    docTokens.forEach(tokens => {
      tokens.forEach(token => vocabSet.add(token));
    });
    this.vocabulary = {};
    let idx = 0;
    for (let term of vocabSet) {
      this.vocabulary[term] = idx++;
    }
    const vocabSize = Object.keys(this.vocabulary).length;

    // Document frequencies
    const df = Array(vocabSize).fill(0);
    docTokens.forEach(tokens => {
      const seen = new Set(tokens);
      seen.forEach(token => {
        const index = this.vocabulary[token];
        df[index] += 1;
      });
    });
    const numDocs = combinedDocs.length;
    this.idf = df.map(freq => Math.log(numDocs / (freq || 1)));

    // Compute TF-IDF vectors for each document (dense representation)
    this.docVectors = docTokens.map(tokens => {
      const vec = Array(vocabSize).fill(0);
      tokens.forEach(token => {
        const index = this.vocabulary[token];
        vec[index] += 1;
      });
      // Multiply term frequency by IDF weight
      for (let i = 0; i < vec.length; i++) {
        vec[i] *= this.idf[i];
      }
      return vec;
    });

    this.paperIds = paperIds;

    // Save computed data to file
    const savedData = {
      vocabulary: this.vocabulary,
      idf: this.idf,
      docVectors: this.docVectors,
      paperIds: this.paperIds
    };
    fs.writeFileSync(this.vectorsPath, JSON.stringify(savedData));
  }

  // Compute a query vector using the saved vocabulary and idf
  computeQueryVector(query) {
    const tokens = tokenize(query);
    const vec = Array(Object.keys(this.vocabulary).length).fill(0);
    tokens.forEach(token => {
      if (this.vocabulary.hasOwnProperty(token)) {
        vec[this.vocabulary[token]] += 1;
      }
    });
    // Multiply by idf
    for (let i = 0; i < vec.length; i++) {
      vec[i] *= this.idf[i];
    }
    return vec;
  }

  // Search for papers given query terms and optional author filter.
  // Returns an array of paper ids (as strings) that match the query.
  async search(queryTerms, author = null, minResults = 25, threshold = 0.3) {
    // Ensure vectors are loaded
    await this.loadOrCreateVectors();
    const queryVector = this.computeQueryVector(this.preprocess(queryTerms));

    // Compute cosine similarity between the query and each document
    const similarities = this.docVectors.map(docVec => cosineSimilarity(docVec, queryVector));

    // Collect indices with similarity above threshold
    let highSimIndices = [];
    similarities.forEach((sim, i) => {
      if (sim >= threshold) {
        highSimIndices.push({ index: i, sim });
      }
    });
    // Sort in descending order of similarity
    highSimIndices.sort((a, b) => b.sim - a.sim);

    // If too few results, add more until reaching minResults
    if (highSimIndices.length < minResults) {
      const sortedAll = similarities
        .map((sim, i) => ({ index: i, sim }))
        .sort((a, b) => b.sim - a.sim);
      const additional = sortedAll.filter(item =>
        !highSimIndices.some(existing => existing.index === item.index)
      ).slice(0, minResults - highSimIndices.length);
      highSimIndices = highSimIndices.concat(additional);
    }

    // Get corresponding paper ids (from the custom "id" field)
    let selectedPaperIds = highSimIndices.map(item => this.paperIds[item.index]);

    // If an author filter is provided, fetch papers matching that filter.
    // (This filtering is done later in the Express endpoint.)
    return selectedPaperIds;
  }

  // Force refresh of document vectors.
  async refreshVectors() {
    await this.computeAndSaveVectors();
  }
}

module.exports.DocumentSearch = DocumentSearch;
