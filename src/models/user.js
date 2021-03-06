const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        required: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({ error: 'Invalid Email address' })
            }
        }
    },
    firstName: {
        type: String,
        required: true
    },
    surName: {
        type: String,
        required: true
    },
    urlAvatar: {
        type: String,
        default: "http://simpleicon.com/wp-content/uploads/user1.png"
    },
    idPrivilege: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true,
});

UserSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

module.exports = mongoose.model("user", UserSchema);