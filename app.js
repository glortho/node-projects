
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

app.get('/.:format?', function(req, res){
	Organization.find({}).populate('contacts').run(function(err, orgs) {
		console.log(orgs);
		res.render('index', { title: 'Express', orgs: orgs || [] });						
	});
});
app.get('/organizations/:id.:format?', function(req, res) {
	Organization.findById(req.params.id).populate('contacts').run(function(err, org) {
		if ( err ) {
			console.log(err);
		} else {
			res.render('organization', {title: 'Organization: ' + org.title, org: org});
		}
	});
});
app.post('/organizations/new.:format?', function(req, res){
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
app.get('/organizations/:id/delete.:format?', function(req, res) {
	Organization.remove({_id: req.params.id}, function() {
		res.redirect('/');
	});
});
app.get('/contacts.:format?', function(req, res) {
	Contact.find({}).populate('organization', ['title', '_id']).run(function(err, contacts) {
		if ( req.params.format != 'json' ) {
			res.render('contacts', {title: 'Contacts', contacts: contacts});
		} else {
			res.send(contacts);
		}
	});
});
app.get('/contacts/:id.:format?', function(req, res) {
	Contact.findOne({_id: req.params.id}).populate('organization', ['title', '_id']).run(function(err, contact) {
		console.log(contact);
		res.render('contact', {title: 'Contact: ' + contact.name_full, contact: contact});
	});
});
app.post('/contacts/new.:format?', function(req, res) {
	var contact = new Contact({name_full: req.body.name}),
		orgname = req.body.name;

	contact.save(function(err) {
		if ( err ) {
			console.log(err);
		} else {
			Organization.findOne({title: orgname}, function(err, org) {
				var organization = err ? new Organization({title: orgname}).save() : org ;

				organization.contacts.push(contact._id);
				contact.organization = organization;
				organization.save();
				contact.save();
				res.redirect('/');
			});	
		}
	});
});
app.get('/contacts/:id/delete.:format?', function(req, res) {
	Contact.remove({_id: req.params.id}, function() {
		res.redirect('/contacts');
	});
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
