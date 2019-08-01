const mongoose = require('mongoose')
const a_ = require('lodash/array')

const parachain_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
        required: true,
    }],
    users_24h: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Users/24h must be a postive number')
            }
        },
        default: 0
    },
    volume_24h: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Volume/24h must be a postive number')
            }
        },
        default: 0
    },
    tx_24h: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Tx/24h must be a postive number')
            }
        },
        default: 0
    },
    activity_7d: {
        type: String,
        trim: true,
        enum: ['', 'very low', 'low', 'medium', 'high', 'very_high'],
        default: ''
    }
}, {
    timestamps: true
})

parachain_schema.methods.toJSON = function () {
    const parachain = this
    const parachain_object = parachain.toObject()

    delete parachain_object.createdAt
    delete parachain_object.updatedAt
    delete parachain_object.__v

    return parachain_object
}


parachain_schema.pre('save', async function (next) {
    const parachain = this

    if (parachain.isModified('tags')) {
        parachain.tags = a_.uniq(parachain.tags)
    }

    next();
})


const Parachain = mongoose.model('Parachain', parachain_schema)

module.exports = Parachain