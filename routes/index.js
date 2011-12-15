
/*
 * GET home page.
 */

exports.index = function(req, res){
	orgs = Organization.find({}, function(err, arr) {
		res.render('index', { title: 'Express', orgs: arr});		
	}); 
};
