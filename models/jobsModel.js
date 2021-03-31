const mongoose = require('mongoose');
const slugify = require('slugify');

const jobsSchema = new mongoose.Schema({
  location: String,
  title: String,
  company: String,
  place: String,
  date: Date,
  applyLink: String,
  Link: String,
  senorityLevel: String,
  functions: String,
  employmentType: String,
});

const Jobs = mongoose.model('Job', jobsSchema);
module.exports = Jobs;
