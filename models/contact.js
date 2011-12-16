function make(Schema, mongoose) {
	var ContactSchema = new	Schema({
		organization	: {type: Schema.ObjectId, ref: 'Organization'},
		name_first		: String,
		name_last		: String
	});	

	ContactSchema
		.virtual('name_full')
		.get(function() {
			return this.name_first + ' ' + this.name_last;
		})
		.set(function(full_name) {
			var split = full_name.split(' '),
				firstName = split[0],
				lastName = split[1];

			this.set('name_first', firstName);
			this.set('name_last', lastName);
		});

	return mongoose.model('Contact', ContactSchema);
}

module.exports.make = make;
