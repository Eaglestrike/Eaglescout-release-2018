var express = require('express');
var router = express.Router();
var Observation = require("../models/observation");
var utils = require("../utils");
var TBA = require("../TBA");
var observationForm = require("../observationForm.js");

router.get('/list'/*, utils.ensureAuthenticated*/, function(req, res) {
	Observation.find({}, function(err, observations) {
		var keys = [];
		var index = 0;
		for (var observation in observations) keys.push(observation);
			function asyncForLoop() {
				if (index == keys.length) {
					res.render('list', {
						observations: observations
					});
				} else {
					TBA.getImage(observations[keys[index]]["team"], image => {
						observations[keys[index ++]]["image"] = image;
						asyncForLoop();
					});
				}
			}
			asyncForLoop();
		});
});

router.get('/new'/*, utils.ensureAuthenticated*/, function(req, res) {
	TBA.getEvents((events) => {
		var structure = observationForm.getObservationFormStructure();
		structure.events = events;
		res.render('new', {
			structure: structure
		});
	});
});

router.post('/new'/*, utils.ensureAuthenticated*/, function(req, res) {
	req.body.user = res.locals.user.email;
	delete req.body.action;
	var newObservation = new Observation(req.body);

	Observation.createObservation(newObservation, function(err, user) {
		if (err) throw err;
	});

	req.flash('success_msg', 'Successfully created observation.');
	res.redirect("/scout");
});

router.get('/'/*, utils.ensureAuthenticated*/, function(req, res) {
	res.render('scout');
});

module.exports = router;