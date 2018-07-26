

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String, required: true
    },
    email: {
        type: String, required: true
    },
    password: {
        type: String, required: true
    },
    profile_pic: {
        type: String
    },
    face_letter: {
        type: String
    },
    face_id: {
        type: String
    },
    gender: {
        type: String
    },
    age: {
        type: String
    },
    contact: {
        type: String
    },
    notification_id: {
        type:String
    },
    platform: {
        type: String
    },
	 device_id: {
        type:String
    },
	notification: {
        type: Boolean,
        default: true
    },
	privacy_policy: {
        type: Boolean,
        default: false
    }
	
});

module.exports = mongoose.model('user', userSchema);