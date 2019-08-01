const express = require('express')
const Tag = require('../models/tag')
const Parachain = require('../models/parachain')
const router = new express.Router()

router.post('/tag', async (req, res) => {
    const tag = new Tag(req.body)

    try { 
        await tag.save()
        res.status(201).send(tag)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tag/id/:id', async (req, res) => {
    try {
        const tag = await Tag.findById({ _id: req.params.id })

        if (!tag) {
            res.status(404).send()
        }
        
        if (req.query.parachain){
            const parachains = await Tag.findOne({name: 'DeFi'})
            res.send({ tag, parachains })
        } 
        else res.send(tag)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tag/title/:name', async (req, res) => {
    try {
        const tag = await Tag.findOne({ name: req.params.name })

        if (!tag) {
            res.status(404).send()
        }
        
        if (req.query.parachain){
            const parachains = await Parachain.find({tags: { $in: [tag._id]}}).populate({path: 'tags', select: "name _id"})

            res.send({tag, parachains})
        } 
        else res.send(tag)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tags', async (req, res) => {
    try {
        const tags = await Tag.find({})
        
        res.send(tags)
    } catch(e) {
        res.status(500).send()
    }
})

module.exports = router