module.exports = function(app, models) {
	var Organization = models.Organization,
		Contact = models.Contact;

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
};
