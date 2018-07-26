const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    rating_id: {
        type: String
    },
	P01: {
        type: String
    },
	P02: {
        type: String
    },
	P03: {
        type: String
    },
	P04: {
        type: String
    },
	P05: {
        type: String
    },
	P06: {
        type: String
    },
	P07: {
        type: String
    },
	P08: {
        type: String
    },
	P09: {
        type: String
    },
	P10: {
        type: String
    },
	P11: {
        type: String
    },
	P12: {
        type: String
    },
	P13: {
        type: String
    },
	P14: {
        type: String
    },
	P15: {
        type: String
    },
	P16: {
        type: String
    }
   
});

module.exports = mongoose.model('rating', ratingSchema);