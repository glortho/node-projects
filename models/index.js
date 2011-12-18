module.exports = function(mongoose){
	var fs = require('fs'),
		models = {};

    fs.readdirSync(__dirname).forEach(function(file) {
		var model, name, model_name;
        if (file == "index.js") return;
        name = file.substr(0, file.indexOf('.'));
        model_name = name.charAt(0).toUpperCase() + name.slice(1);
        models[model_name] = require('./' + name).make(mongoose.Schema, mongoose);
    });

    return models;
};
