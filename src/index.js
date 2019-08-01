const express = require('express')
require('./db/mongoose')

const user_router = require('./routers/user')
const parachain_router = require('./routers/parachain')
const tag_router = require('./routers/tag')

const app = express()
const port = process.env.PORT || 3000

// seeding - temporary - will be relocated with logic
// const tags_seeder = require('./db/seeder/seed_tags')
// tags_seeder()

app.use(express.json())
app.use(user_router)
app.use(parachain_router)
app.use(tag_router)

app.listen(port, ()  => {
    console.log('Server is up on port ' + port)
})