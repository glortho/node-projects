test('Hello World', function() {
	ok(true, 'Divide by Zero!');
});

module('Organizations', {
	setup: function() {
		this.orgStub = sinon.stub(pmt, 'Organization');
		this.model = new Backbone.Model({
			_id: '1',
			title: 'test org'
		});
		this.orgStub.returns(this.model);
		this.organizations = new pmt.OrganizationList();
		this.organizations.model = pmt.Organization;
		this.organizations.add({
			_id: '1',
			title: 'test org'
		});
	},
	teardown: function() {
		this.orgStub.restore();
	}
});

test('should add model', function() {
	equal(this.organizations.length, 1);
});

test("should find a model by id", function() {
  equal(this.organizations.get(1).get("_id"), 1);
});
