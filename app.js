
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	stylus = require('stylus');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pms');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	ContactSchema = new	Schema({
		organization	: {type: ObjectId, ref: 'Organization'},
		name_first		: String,
		name_last		: String,
		digits			: [Digit]
	}),
	OrganizationSchema = new Schema({
		title		: String,
		street		: String,
		city		: String,
		state		: String,
		zip			: String,
		contacts	: [{ type: ObjectId, ref: 'Contact'}]
	}),
	DigitSchema = new Schema({
		digits		: String,
		type		: String
	});

ContactSchema
	.virtual('name_full')
	.get(function() {
		return this.name_first + ' ' + this.name_last;
	})
	.set(function(full_name) {
		var split = full_name.split(' '),
			firstName = split[0],
			lastName = split[1];

		this.set('name_first', firstName);
		this.set('name_last', lastName);
	});

var Organization = mongoose.model('Organization', OrganizationSchema),
	Contact = mongoose.model('Contact', ContactSchema),
	Digit = mongoose.model('Digit', DigitSchema);

var app = module.exports = express.createServer();

// Configuration

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

// Routes

app.get('/', function(req, res){
	// Organization.find({}, function(err, orgs) {
	// 	res.render('index', {title: 'Express', orgs: orgs || []});
	// });
	Organization.find({}).populate('contacts').run(function(err, orgs) {
		console.log(orgs);
		res.render('index', { title: 'Express', orgs: orgs || [] });						
	});
});
app.post('/organization/new', function(req, res){
	var org = new Organization({title: req.body.title});

	org.save(function(err) {
		if (err) {
			console.log(err);
			res.render('index', { title: 'Error', orgs: []});
		} else {
			contact = new Contact({
				name_full: req.body.name,
				organization: org._id
			});
			contact.save(function(err) {
				if ( err ) {
					console.log(err);
				} else {
					org.contacts.push(contact._id);
					org.save(function(err, org) {
						res.redirect('/');
					});
				}
			});
		}
	});
});
app.get('/organization/:id/delete', function(req, res) {
	Organization.remove({_id: req.params.id}, function() {
		res.redirect('/');
	});
});
app.get('/contacts', function(req, res) {
	Contact.find({}).populate('organization').run(function(err, contacts) {
		console.log(contacts);
		res.render('contact', {title: 'Contacts', contacts: contacts});
	});
});
app.get('/contacts/:id/delete', function(req, res) {
	Contact.remove({_id: req.params.id}, function() {
		res.redirect('/contacts');
	});
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
