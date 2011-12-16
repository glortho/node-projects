function make(Schema, mongoose) {
	var DigitSchema = new Schema({
		digits		: String,
		type		: String
	});
	return mongoose.model('Digit', DigitSchema);
}

module.exports.make = make;
