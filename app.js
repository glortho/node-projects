
/**
 * Module dependencies.
 */

var express = require('express'),
	stylus = require('stylus'),

	mongoose = require('mongoose'),
	models = require('./models')(mongoose),
	Organization = models.Organization,

	lib = require('./lib'),
	
	app = module.exports = express.createServer();

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
		res.render('index', { title: 'Express', orgs: orgs || [] });
	});
});

var routes = require('./routes')(app, models, lib);

// generic restful routes

for ( var r in routes ) {
	if (routes.hasOwnProperty(r)) {
		app.get( '/' + r + '.:format?'		, routes[r].index);
		app.post('/' + r + '.:format?'		, routes[r].create);
		app.get( '/' + r + '/:id.:format?'	, routes[r].show);
		app.put( '/' + r + '/:id.:format?'	, routes[r].update);
		app.del( '/' + r + '/:id.:format?'	, routes[r].destroy);
	}
}

app.post('/organizations/:id/contact'					, routes.organizations.contact.create);
app.put('/organizations/:id/contact/:contact_id'		, routes.organizations.contact.update);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
