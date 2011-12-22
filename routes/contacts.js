module.exports = function(app, models, lib) {
	var Organization = models.Organization,
		Contact = models.Contact;

	return {
		index: function(req, res) {
			Contact.find({}, function(err, contacts) {
				if ( !lib.is_json(req) ) {
					res.render('contacts', {title: 'Contacts', contacts: contacts});
				} else {
					res.send(contacts);
				}
			});
		},
	
		show: function(req, res) {
			Contact.findOne({_id: req.params.id}).populate('organization', ['title', '_id']).run(function(err, contact) {
				res.render('contact', {title: 'Contact: ' + contact.name_full, contact: contact});
			});
		},

		create: function(req, res) {
			var contact = new Contact({name_full: req.body.name_full});

			contact.save(function(err) {
				if ( err ) {
					console.log(err);
				} else {
					res.send(contact);
				}
			});
		},

		destroy: function(req, res) {
			Contact.remove({_id: req.params.id}, function() {
				res.redirect('/contacts');
			});
		}
	};
};
