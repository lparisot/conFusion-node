var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var router = express.Router();
router.use(bodyParser.json());

router.route('/')
  .all(Verify.verifyOrdinaryUser)
  .get(function(req, res, next) {
    // get all favorites of the user req.decoded._id
    Favorites.findOne({ postedBy: req.decoded._id })
      .populate('postedBy')
      .populate('dishes')
      .exec(function (err, favorites) {
        if (err) return next(err);

        res.json(favorites);
      });
  })
  .post(function(req, res, next) {
    // add a favorite for the user req.decoded._id
    Favorites.findOne(
      { postedBy: req.decoded._id },
      function (err, favorite) {
        if (err) return next(err);

        // if we don't have favorites, create it
        if(!favorite) {
          favorite = new Favorites({ postedBy: req.decoded._id });
        }

        // if we don't already have this dish as favorite, add it
        var idx = favorite ? favorite.dishes.indexOf(req.body._id) : -1;
        if(idx === -1) {
          favorite.dishes.push(req.body._id);
        }

        favorite.save(function (err, favorite) {
          if (err) return next(err);

          res.json(favorite);
        });
      }
    );
  })
  .delete(function(req, res, next) {
    // delete all favorites of the user req.decoded._id
    Favorites.remove(
      { postedBy: req.decoded._id },
      function (err, resp) {
        if (err) return next(err);

        res.json(resp);
      }
    );
  });

router.route('/:dishObjectId')
  .all(Verify.verifyOrdinaryUser)
  .delete(function(req, res, next) {
    // delete a particular favorite of the user: req.decoded._id
    Favorites.findOne(
      { postedBy: req.decoded._id },
      function (err, favorite) {
        if (err) return res.status(500).send(null);

        var idx = favorite ? favorite.dishes.indexOf(req.params.dishObjectId) : -1;
        if (idx !== -1) {
          favorite.dishes.remove(req.params.dishObjectId);

          favorite.save(function (err, favorite) {
            if (err) return next(err);
            return res.json(favorite);
          });
        } else {
          // does not find this particular dish
          res.status(404).send(null);
        }
      }
    );
  });

module.exports = router;
