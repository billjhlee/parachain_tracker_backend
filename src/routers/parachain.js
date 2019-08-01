const express = require('express')
const Parachain = require('../models/parachain')
const Tag = require('../models/tag')
const router = new express.Router()

router.post('/parachain', async (req, res) => {
    const parachain = new Parachain(req.body)
    try {
        await parachain.save()
        
        res.status(201).send(parachain)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/parachain/:id', async (req, res) => {
    const _id = req.params.id

    try { 
        const parachain = await Parachain.findOne({ _id }).populate({path:'tags', select: 'name _id'})
        res.send(parachain)
    } catch (e) {
        res.status(500).send();
    }
})

// change after adding user roles
router.patch('/parachain/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed_updates = ['name', 'tags', 'users_24h', 'volume_24h', 'tx_24h', 'activity_7d']
    const is_valid_operation = updates.every((update) => allowed_updates.includes(update))

    if (!is_valid_operation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const parachain = await Parachain.findOne({ _id: req.params.id })

        if (!parachain) {
            return res.status(404).send()
        }

        updates.forEach(update => {
            parachain[update] = req.body[update]
        })
        await parachain.save()

        res.send(parachain)
    } catch(e) {
        res.status(400).send(e)
    }
})

// change after adding user roles
router.delete('parachain/:id', async (req, res) => {
    try {
        const parachain = await Parachain.findOneAndDelete({ _id: req.params.id })

        if (!parachain) {
            res.status(404).send()
        }

        res.send(parachain)
    } catch (e) {
        res.status(500).send()
    }
})
module.exports = router