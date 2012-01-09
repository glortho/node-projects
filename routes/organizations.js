module.exports = function(app, models, lib) {
	var Organization = models.Organization,
		Contact = models.Contact;

	return {
		index: function(req, res) {
			Organization.find({}).populate('contacts').run(function(err, orgs) {
				if ( err ) {
					console.log(err);
				} else {
					return lib.is_json(req) ?
						res.send(orgs) :
						res.render('organizations'); // TODO
				}
			});
		},
		show: function(req, res) {
			Organization.findById(req.params.id).populate('contacts').run(function(err, org) {
				if ( err ) {
					console.log(err);
				} else {
					res.render('organization', {title: 'Organization: ' + org.title, org: org});
				}
			});
		},

		create: function(req, res) {
			var org = new Organization({title: req.body.title});

			org.save(function(err) {
				if (err) {
					console.log(err);
					res.render('index', { title: 'Error', orgs: []});
				} else {
					res.send(org);
				}
			});
		},

		destroy: function(req, res) {
			Organization.remove({_id: req.params.id}, function() {
				if ( lib.is_json(req) ) {
					res.send({code: 200});
				} else {
					res.redirect('/');
				}
			});
		},

		contact: { // TODO: these should really go to contact router
			create: function(req, res) {
				var org_id = req.params.id,
					contact = new Contact({
						organization: org_id,
						name_full: req.body.name_full
					});

				contact.save(function(err) {
					if ( err ) {
						
					} else {
						Organization.findById(org_id, function(err, org) {
							org.contacts.push(contact);
							org.save(function(err) {
								if ( err ) {
								
								} else {
									res.send(contact);
								}
							});
						});
					}
				});
			},
			update: function(req, res) {
				Contact.findById(req.params.contact_id, function(err, contact) {
					contact.details = req.body.details;
					contact.save(function(err) {
						if ( !err ) {
							res.send(contact);
						}
					});
				});
			}
		}
	};
};
