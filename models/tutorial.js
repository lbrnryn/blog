const mongoose = require('mongoose');
const marked = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

const tutorialSchema = new mongoose.Schema({
  title: String,
  description: String,
  lesson: String,
  markedHtml: String
});

tutorialSchema.pre('validate', function(next) {
  if (this.lesson) {
    this.markedHtml = dompurify.sanitize(marked.parse(this.lesson));
  }
  next()
});


module.exports = mongoose.model('Tutorial', tutorialSchema);
