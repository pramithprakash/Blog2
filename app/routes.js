var mongojs = require('mongojs'); 					// mongojs for mongodb
var database = require('../config/database'); 		// load the database config
var ObjectId = mongojs.ObjectId;
var db = mongojs(database.url);
var Blog = db.collection('Blogs');
var showdown  = require('showdown'),
    converter = new showdown.Converter();
   
Blog.createIndex( { orderDate: -1 } )

function getBlogs(res){

	Blog.find().sort({createdDate:-1}, function(err, blogs) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)
			//blogs = blogs.reverse()
			res.json(blogs); // return all blogs in JSON format
		});
};

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all blogs
	app.get('/api/blogs', function(req, res) {

		// use mongoose to get all blogs in the database
		getBlogs(res);
	});

	// create blog and send back all blog after creation
	app.post('/api/blogs', function(req, res) {
		// create a blog, information comes from AJAX request from Angular
		var tags = [];
    	var html = converter.makeHtml(req.body.description);
    	tags = req.body.tags;
    	tags.push('ALL')

		Blog.insert({
			title : req.body.title,
			description : html,
			date : req.body.date,
			createdDate : req.body.createdDate,
			tags : tags 
		}, function(err, blog) {
			if (err)
				res.send(err);

			// get and return all the blog after you create another
			getBlogs(res);
		});

	});

	// delete a todo
	app.delete('/api/blogs/:blog_id', function(req, res) {
		Blog.remove({
			_id : ObjectId(req.params.blog_id),
		}, function(err, blog) {
			if (err)
				res.send(err);

			getBlogs(res);
		});
	});

	

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};