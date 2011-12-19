$(function() {
	Backbone.Model.prototype.idAttribute = "_id"; // need this for mongodb/mongoose

	// contacts

	pmt.Contact = Backbone.Model.extend({
		
	});

	pmt.ContactList = Backbone.Collection.extend({
		model: pmt.Contact,
		url: '/contacts'
	});

	pmt.Contacts = new pmt.ContactList;

	pmt.ContactView = Backbone.View.extend({
		
	});


	// organizations

	pmt.Organization = Backbone.Model.extend({
		
	});

	pmt.OrganizationList = Backbone.Collection.extend({
		model: pmt.Organization,
		url: '/organizations'
	});

	pmt.Organizations = new pmt.OrganizationList;

	pmt.OrganizationView = Backbone.View.extend({
		tagName: 'div',
		template: _.template(document.getElementById('tmpl-organization-item').innerHTML),
		events: {
			'click .remove': 'clear'
		},

		initialize: function() {
			this.model.bind('destroy', this.remove, this);
		},

		clear: function() {
			console.log(this);
			this.model.destroy({
				success: function() {
					console.log('destroy success');
				}
			});
		},

		remove: function() {
			$(this.el).remove();
		},

		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		}
	});

	pmt.AppView = Backbone.View.extend({
		el: $('#body-wrapper'),
		events: {
			"submit #organization-form":  "createOnEnter"
		},

		initialize: function() {
			this.title_input = document.getElementById('organization-title');
			this.contact_input = document.getElementById('contact-name');
			pmt.Organizations.bind('add', this.addOne, this);
			pmt.Organizations.bind('reset', this.addAll, this);
			pmt.Organizations.bind('all', this.render, this);
			pmt.Organizations.fetch();
		},

		addAll: function() {
			pmt.Organizations.each(this.addOne);
		},

		addOne: function(org) {
			var view = new pmt.OrganizationView({model: org});
			this.$("#organizations").append(view.render().el);
		},

		createOnEnter: function(e) {
			var title = this.title_input.value,
				name = this.contact_input.value;

			if (title) {
				pmt.Organizations.create({title: title, contact: name});
				this.title_input.value = '';
				this.contact_input.value = '';
				this.title_input.focus();
			}
			return false;
		},

		render: function() {
				
		}
	});

	pmt.App = new pmt.AppView;
});
