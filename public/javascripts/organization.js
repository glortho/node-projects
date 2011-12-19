$(function() {
	pmt.Organization = Backbone.Model.Extend({
		
	});

	pmt.OrganizationList = Backbone.Collection.Extend({
		model: pmt.Organization
	});

	pmt.Organizations = new OrganizationList;
});
