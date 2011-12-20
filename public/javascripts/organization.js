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
		tagName: 'div',
		template: _.template(document.getElementById('tmpl-contact-item').innerHTML),
		events: {
			'click .remove': 'clear'
		},

		initialize: function() {
			this.model.bind('destroy', this.remove, this);
		},

		clear: function() {
			this.model.destroy();
		},

		remove: function() {
			$(this.el).remove();
		},

		render: function() {
			var json = this.model.toJSON();

			if (!json.organization) json.organization = null;
			$(this.el).html(this.template(json));
			return this;
		}
	});

	pmt.ContactTabView = Backbone.View.extend({
		el: $('#contacts-wrapper'),
		events: {
			"submit #contact-form":  "createOnEnter"
		},

		initialize: function() {
			this.contact_input = document.getElementById('contact-name-full');
			this.organization_input = document.getElementById('contact-organization-title');
			pmt.Contacts.bind('add', this.addOne, this);
			pmt.Contacts.bind('reset', this.addAll, this);
			pmt.Contacts.bind('all', this.render, this);
			pmt.Contacts.fetch();
		},

		addAll: function() {
			pmt.Contacts.each(this.addOne);
		},

		addOne: function(contact) {
			var view = new pmt.ContactView({model: contact});
			this.$("#contacts").append(view.render().el);
		},

		createOnEnter: function(e) {
			var org = this.organization_input.value,
				name = this.contact_input.value;

			if (title) {
				pmt.Contacts.create({name_full: name, organization: org});
				this.organization_input.value = '';
				this.contact_input.value = '';
				this.contact_input.focus();
			}
			return false;
		},

		render: function() {
				
		}
	});

	pmt.ContactTab = new pmt.ContactTabView;


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
			this.model.destroy();
		},

		remove: function() {
			$(this.el).remove();
		},

		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		}
	});

	pmt.OrgTabView = Backbone.View.extend({
		el: $('#organizations-wrapper'),
		events: {
			"submit #organization-form":  "createOnEnter"
		},

		initialize: function() {
			this.title_input = document.getElementById('organization-title');
			this.contact_input = document.getElementById('contact-name');
			pmt.Organizations.bind('add', this.append, this);
			pmt.Organizations.bind('reset', this.addAll, this);
			pmt.Organizations.bind('all', this.render, this);
			pmt.Organizations.fetch();
		},

		addAll: function() {
			pmt.Organizations.each(this.addOne);
		},

		addOne: function(org) {
			var view = new pmt.OrganizationView({model: org});
			$("#organizations").append(view.render().el);
		},

		append: function(org) {
			this.addOne(org);

			var attrs = org.attributes,
				contact = attrs.contacts[0],
				cmodel = {
					_id: contact._id,
					name_first: contact.name_first,
					name_last: contact.name_last,
					organization: {
						_id: attrs._id,
						title: attrs.title
					}
				};

			pmt.ContactTab.addOne(new pmt.Contact(cmodel));
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

	pmt.OrgTab = new pmt.OrgTabView;
});
