const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/user', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {

        res.status(400).send(e)
    }
})

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/user/logout_all', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/user/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/user/update', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed_updates = ['first_name', 'last_name', 'user_name', 'email', 'password', 'age']
    const is_valid_operation = updates.every(update => {
        return allowed_updates.includes(update)
    })

    if (!is_valid_operation) {
        return res.status(400).send({ error: 'Invaid Updates '})
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save();
        res.send(req.user)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/user', auth, async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.user._id})

        if (!user) {
            res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router;