var express = require('express');
var router = express.Router();
var User = require('../models/user');

var Article = require('../models/article');
var Comment = require('../models/comment');

router.get('/', (req, res, next) => {
  console.log(req.session.userId, 'from articles......');
  var session = req.session.userId;
  Article.find({}, (err, articles, next) => {
    console.log(err, articles, session);
    if (err) return next(err);
    User.findById(session, (err, user) => {
      if (err) return next(err);
      res.render('articles', {
        articles: articles,
        session: session,
        user: user,
      });
    });
  });
});

router.get('/new', (req, res, next) => {
  res.render('createArticle');
});

router.post('/', (req, res, next) => {
  Article.create(req.body, (err, user) => {
    console.log(err, req.body);
    if (err) return next(err);
    res.redirect('/articles');
  });
});

router.get('/:slug', (req, res, next) => {
  let session = req.session.userId;
  let slug = req.params.slug;
  Article.find({ slug }, (err, article) => {
  
    if (err) return next(err);
    console.log(article);

    res.render('singleArticle', { article: article[0], session: session });
    
  });
});

router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndDelete(id, (err) => {
    if (err) next(err);
    Comment.deleteMany({ articleId: id }, (err, info) => {
      if (err) next(err);
      res.redirect('/articles');
    });
  });
});

router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (err, article) => {
    if (err) next(err);
    res.render('updateArticle', { article: article });
  });
});

router.post('/:id/edit', (req, res) => {
  let id = req.params.id;
  console.log(req.body);
  Article.findByIdAndUpdate(
    id,
    req.body,
    { new: true },
    (err, updatedArticle) => {
      if (err) next(err);
      res.redirect('/articles/' + id);
    }
  );
});

router.get('/:slug/like', (req, res, next) => {
  let slug = req.params.slug;
  console.log(req);
  Article.findOneAndUpdate(
    { slug },
    { $inc: { likes: 1 } },
    (err, updatedArticle) => {
      res.redirect('/articles/' + slug);
    }
  );
});

router.get('/:slug/dislike', (req, res, next) => {
  let slug = req.params.slug;
  console.log(req);
  Article.findOneAndUpdate(
    { slug },
    { $inc: { likes: -1 } },
    (err, updatedArticle) => {
      res.redirect('/articles/' + slug);
    }
  );
});

router.post('/:id/comments', (req, res, next) => {
  var id = req.params.id;
  console.log(req.body);
  console.log('hello comment');
  req.body.articleId = id;
  Comment.create(req.body, (err, comment) => {
    if (err) next(err);
    Article.findByIdAndUpdate(
      id,
      { $push: { commentId: comment._id } },
      (err, article) => {
        if (err) next(err);
        res.redirect('/articles/' + article.slug);
      }
    );
  });
});
module.exports = router;
