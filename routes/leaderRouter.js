var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Leaders = require('../models/leadership');
var Verify = require('./verify');

var router = express.Router();
router.use(bodyParser.json());

router.route('/')
  .get(function(req, res, next) {
    Leaders.find(req.query, function (err, leaders) {
      if (err) return next(err);

      res.json(leaders);
    });
  })
  .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Leaders.create(req.body, function (err, leader) {
      if (err) return next(err);

      console.log('Leader created!');
      var id = leader._id;
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });

      res.end('Added the leader with id: ' + id);
    });
  })
  .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Leaders.remove({}, function (err, resp) {
      if (err) return next(err);

      res.json(resp);
    });
  });

router.route('/:id')
  .get(function(req,res,next) {
    Leaders.findById(req.params.id, function (err, leader) {
      if (err) return next(err);

      res.json(leader);
    });
  })
  .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Leaders.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, {
      new: true
    }, function (err, leader) {
      if (err) return next(err);

      res.json(leader);
    });
  })
  .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Leaders.findByIdAndRemove(req.params.id, function (err, resp) {
      if (err) return next(err);

      res.json(resp);
    });
  });

module.exports = router;
