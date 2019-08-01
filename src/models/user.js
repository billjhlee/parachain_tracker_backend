const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const user_schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true 
    },
    last_name: { 
        type: String,
        required: true,
        trim: true
    },
    user_name: {
        type: String,
        required: true,
        trim: true
    },
    email: { 
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    // avatar: { 
    //     type: Buffer
    // }
    },
    {
        timestamps: true
    }
)

user_schema.methods.toJSON = function () { 
    const user = this
    const user_object = user.toObject()

    delete user_object.password
    delete user_object.tokens
    delete user_object.avatar

    delete user_object.createdAt
    delete user_object.updatedAt
    delete user_object.__v

    return user_object
}

user_schema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'saltbaesaltybae')

    user.tokens = user.tokens.concat({ token })
    await user.save()
    
    return token
}

user_schema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

user_schema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// for cascade remove
user_schema.pre('remove', async (next) => {
    // const user = this
    next();
})

const User = mongoose.model('User', user_schema)

module.exports = User