const mongoose = require("mongoose");

const DsaSchema = new mongoose.Schema({
  topic: String,
  solvedCount: Number,
});

const ResumeChecklistSchema = new mongoose.Schema({
  photo: Boolean,
  projects: Boolean,
  twoPageLimit: Boolean,
  keywordsIncluded: Boolean,
});

const InterviewSchema = new mongoose.Schema({
  date: Date,
  company: String,
  feedback: String,
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  college: String,
  branch: String,
  gradYear: Number,
  dsaProgress: [DsaSchema],
  resumeChecklist: ResumeChecklistSchema,
  interviewPrep: [InterviewSchema],
});

module.exports = mongoose.model("User", UserSchema);
