var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

var monk = require('monk');
var fetchedVideos = [];
var videoByGenre = [];
var db = monk('localhost:27017/vidzy');

router.get('/videos', function(req, res) {
	var collection = db.get('videos');
	collection.find({}, function(err, videos){
		if (err) throw err;
		fetchedVideos = videos;
		videoByGenre = videos;
	  	res.render('index', {videos: videos});
	});
});

router.get('/', function(req, res, next) {
  res.redirect('/videos');
});

router.get('/videos/new', function(req, res, next) {
  res.render('new');
});

router.delete('/videos/:id', function(req, res) {
	var collection = db.get('videos');
	collection.remove({ _id: req.params.id }, function(err, video){
		if (err) throw err;
    res.redirect('/videos');
	});
});

router.post('/videos', function(req, res) {
	var collection = db.get('videos');
	collection.insert({
    title: req.body.title,
    genre: req.body.genre,
    image: req.body.image,
    description: req.body.desc
  }, function(err, videos){
		if (err) throw err;
	  	res.redirect('/videos');
	});
});

router.get('/videos/:id/edit', function(req, res) {
	var collection = db.get('videos');
	collection.findOne({ _id: req.params.id }, function(err, video){
		if (err) throw err;
	  	res.render('update', {video: video});
	});
});

router.put('/videos/:id', function(req, res) {
	var collection = db.get('videos');
	var video = {
		title: req.body.title,
		genre: req.body.genre,
		image: req.body.image,
		description: req.body.desc
	};
	collection.update({ _id: req.params.id }, {$set : video}, function(err, dbResponse){
		if (err) throw err;
		res.redirect('/videos/'+req.params.id);
	});
});

router.get('/videos/:id', function(req, res) {
	var collection = db.get('videos');
	collection.findOne({ _id: req.params.id }, function(err, video){
		if (err) throw err;
	  	res.render('show', {video: video});
	});
});

router.post('/videos/search', function(req, res) {
	var videos = [];
	var titleText = req.body.search;
	if(titleText!=undefined){
		titleText = titleText.toLowerCase();
	}
	videoByGenre.forEach(function(video){
		if(video.title.toLowerCase().includes(titleText)){
			videos.push(video);
		}
	});
	res.render('index', {videos: videos});
});

router.get('/videos/genre/:genre', function(req, res) {
	var videos = [];
	var genre = req.params.genre;
	fetchedVideos.forEach(function(video){
		if(video.genre===genre || genre==='All'){
			videos.push(video);
		}
	});
	videoByGenre = videos;
	res.render('index', {videos: videos});
});
module.exports = router;
