// interestAmplifier.js
const keyword_extractor = require('keyword-extractor');

class InterestAmplifier {
  /**
   * @param {string} text - The text from which to extract keywords.
   * @param {Object} user - A user object with an 'interests' string property and a save() method.
   */
  constructor(text, user) {
    this.text = text;
    this.user = user;
    // Extract keywords using keyword-extractor
    this.keywords = keyword_extractor.extract(text, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false
    });
  }

  // Update user's interests by appending new keywords and keeping only the last 5
  async updateInterests(newKeywords) {
    let interests = this.user.interests ? this.user.interests.split(' ') : [];
    interests = interests.concat(newKeywords);
    interests = interests.slice(-5); // keep only last 5 interests
    this.user.interests = interests.join(' ');
    await this.user.save();
  }

  async fromSearch() {
    if (this.text === this.user.interests) return;
    await this.updateInterests(this.keywords);
  }

  async fromPdf() {
    const newKw = this.keywords.length > 3 ? this.keywords.slice(0, 3) : this.keywords;
    await this.updateInterests(newKw);
  }

  async fromPaper() {
    const newKw = this.keywords.length > 3 ? this.keywords.slice(0, 3) : this.keywords;
    await this.updateInterests(newKw);
  }
}

module.exports.InterestAmplifier = InterestAmplifier;
