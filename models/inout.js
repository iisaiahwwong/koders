var mongoose = require('mongoose');
Schema = mongoose.Schema;

var inoutSchema = new Schema({

    "in": { type: Number },
    "out": { type: Number },

});

inoutSchema.pre('save', function (next, done) {

    var currentDate = new Date();

    if (!this.create_timestamp) this.create_timestamp = currentDate;

    next();

})

module.exports = mongoose.model('InOut', inoutSchema);