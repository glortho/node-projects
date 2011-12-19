module.exports = {
	is_json: function(req) {
		return ( req.params.format == 'json' || req.accepts('application/json') );
	}
};
