var mongoose = require('mongoose');
Schema = mongoose.Schema;

var locationSchema = new Schema({

    "id": { type: Number, require: true },
    "description": { type: String },
    "name": { type: String },
    "encodingType": { type: String },
    "location": {
        "coordinates": [String],
        "timestamp": { type: Date }
    }

});

locationSchema.pre('save', function (next, done) {

    var currentDate = new Date();

    if (!this.create_timestamp) this.create_timestamp = currentDate;

    next();

})

module.exports = mongoose.model('Location', locationSchema);