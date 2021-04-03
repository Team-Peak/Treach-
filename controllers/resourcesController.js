const handlerFactory = require('./handlerFactory');
const Pdfs = require('../models/resources');
const handleAsync = require('./../utils/handleAsync');
const path = require('path');

const express = require('express');
const multer = require('multer');
const app = express();

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/img/pdf'), // destination folder
  filename: (req, file, cb) => {
    cb(null, uuid.v4() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  dest: path.join(__dirname, 'public/img/'), // destination folder
  limits: { fileSize: 3500000 }, // size we will acept, not bigger
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|pdf/; // filetypes you will accept
    const mimetype = filetypes.test(file.mimetype); // verify file is == filetypes you will accept
    const extname = filetypes.test(path.extname(file.originalname)); // extract the file extension
    // if mimetype && extname are true, then no error
    if (mimetype && extname) {
      return cb(null, true);
    }
    // if mimetype or extname false, give an error of compatibilty
    return cb("The uploaded file, isn't compatible :( we're sorry");
  },
}).single('file'); // This is the field where is the input type="file", we only accept 1 image

exports.setIDs = handleAsync(async (req, res, next) => {
    
  if (!req.body.teacher) req.body.teacher = req.user.id;
  console.log(req.teacher)
  if (req.files) {
    const filename = `file-${req.params.id}-${Date.now()}-${i + 1}.pdf`;
    req.body.pdfName = filename;
  }
  next();
});
exports.createresource = handlerFactory.createOne(Pdfs);
exports.getAllResources = handlerFactory.getAll(Pdfs);
exports.uploadResources = app.use(upload);
