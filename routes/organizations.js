module.exports = function(app, models) {
	var Organization = models.Organization,
		Contact = models.Contact;

	return {
		index: function(req, res) {
			Organization.find({}, function(err, orgs) {
				if ( err ) {
					console.log(err);
				} else {
					res.send(orgs);
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
		},

		destroy: function(req, res) {
			Organization.remove({_id: req.params.id}, function() {
				res.redirect('/');
			});
		}
	};
};
