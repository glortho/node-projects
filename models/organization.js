function make(Schema, mongoose) {
   OrganizationSchema = new Schema({
		title		: String,
		street		: String,
		city		: String,
		state		: String,
		zip			: String,
		contacts	: [{type: Schema.ObjectId, ref: 'Contact'}]
	});

	return mongoose.model('Organization', OrganizationSchema);
}

module.exports.make = make;
