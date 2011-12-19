module.exports = function(app, models, lib) {
	var Organization = models.Organization,
		Contact = models.Contact;

	return {
		index: function(req, res) {
			Organization.find({}).populate('contacts').run(function(err, orgs) {
				if ( err ) {
					console.log(err);
				} else {
					console.log(orgs);
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
					contact = new Contact({
						name_full: req.body.contact,
						organization: org._id
					});
					contact.save(function(err) {
						if ( err ) {
							console.log(err);
						} else {
							org.contacts.push(contact._id);
							org.save(function(err) {
								var output = {_id: org._id, title: org.title, contacts: [contact]};
								if ( lib.is_json(req) ) {
									res.send(output);
								} else {
									res.redirect('/');
								}
							});
						}
					});
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
		}
	};
};
