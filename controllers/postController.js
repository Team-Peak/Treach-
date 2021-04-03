const Post = require('./../models/postModel');
const handleAsync = require('./../utils/handleAsync');
const AppError = require('./../utils/AppError');
const APIFeatures = require('./../utils/apifeatures');
const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPostImages = upload.fields([{ name: 'images', maxCount: 3 }]);

// upload.single('image') req.file
// upload.array('images', 5) req.files

exports.resizePostImages = handleAsync(async (req, res, next) => {
  if (!req.files.images) return next();

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `post-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/posts/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.getAllPosts = handleAsync(async (req, res, next) => {
  const features = new APIFeatures(Post.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const posts = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});

exports.getPost = handleAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  // Post.findOne({ _id: req.params.id })
  const paragraphs = post.summary;
  console.log(typeof paragraphs);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      post,
      paragraph,
    },
  });
});

exports.createPost = handleAsync(async (req, res, next) => {
  if (req.body.images === 'undefined') {
     req.body.images = "default.jpg"
  }
  const newPost = await Post.create(req.body);
  console.log(newPost);

  res.status(201).json({
    status: 'success',
    data: {
      post: newPost,
    },
  });
});

exports.updatePost = handleAsync(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

exports.setPostUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.author) req.body.author = req.user.id;
  next();
};

exports.deletePost = handleAsync(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
