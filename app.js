
/**
 * Module dependencies.
 */

var express = require('express'),
	stylus = require('stylus'),

	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	models = require('./models')(Schema, mongoose),
	
	app = module.exports = express.createServer(),
	routes = require('./routes')(app, models);

mongoose.connect('mongodb://localhost/pms');


// app configuration

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(require("stylus").middleware({
		src: __dirname + "/public",
		compress: true
	}));
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
	app.use(express.errorHandler()); 
});


// routes (mostly in ./routes)

app.get('/.:format?', function(req, res){
	Organization.find({}).populate('contacts').run(function(err, orgs) {
		console.log(orgs);
		res.render('index', { title: 'Express', orgs: orgs || [] });						
	});
});


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
