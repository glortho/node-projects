$(function() {
	Backbone.Model.prototype.idAttribute = "_id"; // need this for mongodb/mongoose


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
			$("#organizations").append(view.render().el);
		},

		// append: function(org) {
		// 	this.addOne(org);

		// 	var attrs = org.attributes,
		// 		contact = attrs.contacts[0],
		// 		cmodel = {
		// 			_id: contact._id,
		// 			name_first: contact.name_first,
		// 			name_last: contact.name_last,
		// 			organization: {
		// 				_id: attrs._id,
		// 				title: attrs.title
		// 			}
		// 		};

		// 	pmt.ContactTab.addOne(new pmt.Contact(cmodel));
		// },

		createOnEnter: function(e) {
			var title = this.title_input.value;

			if (title) {
				pmt.Organizations.create({title: title});
				this.title_input.value = '';
				this.title_input.focus();
			}
			return false;
		},

		render: function() {
				
		}
	});

	pmt.OrgTab = new pmt.OrgTabView;


	// contacts

		// models

	pmt.Contact = Backbone.Model.extend({

	});

		// collections

	pmt.ContactList = Backbone.Collection.extend({
		model: pmt.Contact,
		url: '/contacts'
	});


	pmt.Contacts = new pmt.ContactList;

		// views

	pmt.ContactView = Backbone.View.extend({
		tagName: 'div',
		className: 'item',
		events: {
			'click .remove': 'clear',
			'click .add-detail': 'addDetail'
		},
		tmpl_add_detail: _.template(document.getElementById('tmpl-add-detail').innerHTML),

		initialize: function(options) {
			this.template = _.template(document.getElementById(options.template_id).innerHTML);
			this.model.bind('destroy', this.remove, this);
		},

		addDetail: function(event) {
			var form = this.tmpl_add_detail,
				that = this;

			$(event.target).before(form);
			$(form)
				.find('input').focus().end()
				.on('submit', function() {
					console.log(that.model);
					return false;
				});
		},

		clear: function() {
			this.model.destroy();
		},

		remove: function() {
			var id = this.model.id,
				attrs = this.model.attributes,
				org_id = attrs.organization ? attrs.organization._id : null,
				ct, organization;

			$(this.el).remove();

			if (this.options.type && this.options.type == 'sub') {
				ct = pmt.Contacts.get(id);
				if (ct) ct.destroy();
			} else if ( org_id && pmt.ContactSubTab[org_id] ) {
				pmt.ContactSubTab[org_id].Contacts.remove(this.model);
			} else if ( org_id ) {
				organization = pmt.Organizations.get(org_id);
				ct = organization.attributes.contacts;
				for (var i = ct.length - 1; i >= 0; i--) {
					if ( ct[i]._id == id ) organization.attributes.contacts.splice(i, 1);
				}
			}
		},

		render: function() {
			var json = this.model.toJSON();
			
			$(this.el).html(this.template(json));
			return this;
		}
	});

	pmt.ContactSubTabView = Backbone.View.extend({
		initialize: function(options) {
			_.bindAll(this);
			this.el = $('#contacts-' + options.id).on('submit', '#subform', this.createOnEnter);
			this.org = pmt.Organizations._byId[options.id];
			this.Contacts = new pmt.ContactList(this.org.attributes.contacts);
			this.Contacts.url = this.org.url() + '/contact';
			this.bind();
			this.form = _.template(document.getElementById('tmpl-sub-contact-form').innerHTML);
			this.el.append(this.form);
			this.input = this.el.find('input')[0];
			this.addAll();
		},

		bind: function() {
			this.Contacts.bind('add', this.addOne, this);
			this.Contacts.bind('reset', this.addAll, this);
			this.Contacts.bind('all', this.render, this);
			this.Contacts.bind('remove', this.remove, this);
		},

		addAll: function() {
			this.Contacts.each(this.addOne);
		},

		addOne: function(contact) {
			var view = new pmt.ContactView({
				model: contact,
				template_id: 'tmpl-sub-contact',
				type: 'sub'
			});
			this.el.append(view.render().el);
			if ( !pmt.Contacts._byId[contact.id] ) {
				contact.collection = pmt.Contacts;
				pmt.Contacts.add(contact);
			}
		},
		createOnEnter: function(e) {
			var name = this.input.value;

			if (name) {
				this.Contacts.create({name_full: name});
				this.input.value = '';
				this.input.focus();
			}
			return false;
		},
		remove: function(contact) {
			$('#sub-contact-' + contact.id).remove();
		},
		render: function() {

		}
	});

	pmt.ContactTabView = Backbone.View.extend({
		el: $('#contacts-wrapper'),
		events: {
			"submit #contact-form":  "createOnEnter"
		},

		initialize: function() {
			this.contact_input = document.getElementById('contact-name');
			pmt.Contacts.bind('add', this.addOne, this);
			pmt.Contacts.bind('reset', this.addAll, this);
			pmt.Contacts.bind('all', this.render, this);
			pmt.Contacts.fetch();
		},

		addAll: function() {
			pmt.Contacts.each(this.addOne);
		},

		addOne: function(contact) {
			var view = new pmt.ContactView({
				model: contact,
				template_id: 'tmpl-contact-item'
			});
			this.$("#contacts").append(view.render().el);
		},

		createOnEnter: function(e) {
			var name = this.contact_input.value;

			if (name) {
				pmt.Contacts.create({name_full: name});
				this.contact_input.value = '';
				this.contact_input.focus();
			}
			return false;
		},

		render: function() {
				
		}
	});

	pmt.ContactTab = new pmt.ContactTabView;

});
