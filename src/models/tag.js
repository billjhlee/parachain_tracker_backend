const mongoose = require('mongoose')

const tag_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    }
}, {
    timestamps: true,
})

tag_schema.virtual('parachains', {
    ref: 'Parachain',
    localField: '_id',
    foreignField: 'tags'
})

tag_schema.methods.toJSON = function () {
    const tag = this
    const tag_object = tag.toObject()

    delete tag_object.createdAt
    delete tag_object.updatedAt
    delete tag_object.__v

    return tag_object
}

const Tag = mongoose.model('Tag', tag_schema)

module.exports = Tag