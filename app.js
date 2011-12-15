
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	stylus = require('stylus');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pms');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var OrganizationSchema = new Schema({
	title		: String,
	street		: String,
	city		: String,
	state		: String,
	zip			: String,
	contacts	: [Contact]
});

var ContactSchema = new	Schema({
	organization	: ObjectId,
	first_name		: String,
	last_name		: String,
	digits			: [Digit]
});

var DigitSchema = new Schema({
	digits		: String,
	type		: String
});

var Organization = mongoose.model('Organization', OrganizationSchema),
	Contact = mongoose.model('Contact', ContactSchema),
	Digit = mongoose.model('Digit', DigitSchema);


var Receipt = mongoose.model('Receipt', ReceiptSchema);

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
