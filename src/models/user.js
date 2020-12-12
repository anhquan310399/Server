const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const privilegeDB = require('./privilege');

const UserSchema = mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        default: this.code
    },
    idPrivilege: {
        type: String,
        required: true,
        validate: value => {
            privilegeDB.findOne({ role: value })
                .then(privilege => {
                    if (!privilege) {
                        throw new Error({ error: 'Not found privilege' });
                    }
                });
        }
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({ error: 'Invalid Email address' });
            } else if (value.split('@').pop().includes('hcmute.edu.vn')) {
                throw new Error({ error: 'Email address not in HCMUTE' });
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
    facebookId: String
        // ,
        // tokens: [{
        //     token: {
        //         type: String,
        //         required: true
        //     }
        // }]
}, {
    timestamps: true,
});


const saltRounds = 10;
// hash the password before the user is saved
UserSchema.pre('save', function(next) {
    var user = this;
    // hash the password only if the password has been changed or user is new
    if (!user.isModified('password')) return next();

    // generate the hash
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        if (err) return next(err);
        // change the password to the hashed version
        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function(password) {
    var user = this;

    return bcrypt.compareSync(password, user.password);
};

UserSchema.methods.generateAuthToken = function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({
            _id: user._id,
            code: user.code,
            idPrivilege: user.privilege,
            emailAddress: user.emailAddress
        }, process.env.JWT_KEY, {
            expiresIn: '24h'
        })
        // user.tokens = user.tokens.concat({ token })
        // await user.save()
    return token
}

module.exports = mongoose.model("user", UserSchema);