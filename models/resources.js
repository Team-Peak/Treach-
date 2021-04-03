const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, 'A resource requires a new label'],
    },
    level: {
      type: String,
      required: [true, 'a resource requires level of study '],
    },
    pdfName: String,
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: 'A post must be created by a user',
    },
  },
  {
    toJSON: true,
    toObject: true,
  }
);

resourceSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'teacher',
    select: 'fname',
  });
  next();
});

const Pdfs = mongoose.model('Pdf', resourceSchema);

module.exports = Pdfs;
