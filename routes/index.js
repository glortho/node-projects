module.exports = function(app, models, lib){
	var fs = require('fs'),
		routes = {};

    fs.readdirSync(__dirname).forEach(function(file) {
        if (file == "index.js") return;
        var name = file.substr(0, file.indexOf('.'));
        routes[name] = require('./' + name)(app, models, lib);
    });
    return routes;
};
