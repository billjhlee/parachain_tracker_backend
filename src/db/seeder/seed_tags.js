const Tag = require('../../models/tag')

let seed_tags = () => {
    // tags to be filled
    const tags = [
        {name: 'Gaming'},
        {name: 'DeFi'},
        {name: 'Protocol'},
        {name: 'Layer 2'}
    ]

    console.log('Seeding Tags....')

    tags.forEach(tag => {
        let new_tag = new Tag(tag)
        new_tag.save()
        console.log(`Tag ${tag.name} saved!`)
    })

    console.log('Seeding Tag Finished!')
}

module.exports = seed_tags