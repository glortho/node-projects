$(function() {
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

		initialize: function() {
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

		render: function() {
				
		}
	});

	pmt.App = new pmt.AppView;
});
