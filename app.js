// third party libs
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// node libs
const fs = require('fs')

app.set('view engine', 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    fs.readFile('./data/keeper.json', (err, data) => {
        if (err) throw err

        const keepers = JSON.parse(data)

        res.render('home', { keepers: keepers })
    })
})

app.post('/add', (req, res) => {
    const formData = req.body

    if (formData.keeper.trim() == '') {
        fs.readFile('./data/keeper.json', (err, data) => {
            if (err) throw err

            const keepers = JSON.parse(data)

            res.render('home', { error: true, keepers: keepers })
        })
    } else {
        fs.readFile('./data/keeper.json', (err, data) => {
            if (err) throw err

            const keepers = JSON.parse(data)

            const keeper = {
                id: id(),
                description: formData.keeper,
                done: false
            }

            keepers.push(keeper)

            fs.writeFile('./data/keeper.json', JSON.stringify(keepers), (err) => {
                if (err) throw err

                fs.readFile('./data/keeper.json', (err, data) => {
                    if (err) throw err

                    const keepers = JSON.parse(data)

                    res.render('home', { success: true, keepers: keepers })
                })
            })
        })
    }
})

app.get('/:id/delete', (req, res) => {
    const id =  req.params.id

    fs.readFile('./data/keeper.json', (err, data) => {
        if (err) throw err

        const keepers = JSON.parse(data)

        const filteredKeepers = keepers.filter(keeper => keeper.id != id)
    
        fs.writeFile('./data/keeper.json', JSON.stringify(filteredKeepers), (err) => {
            if (err) throw err

        res.render('home', { keepers: filteredKeepers, deleted: true })
        })
    })
})

app.get('/:id/update', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/keeper.json', (err, data) => {
        if (err) throw err

        const keepers = JSON.parse(data)
        const keeper = keepers.filter(keeper => keeper.id == id)[0]
    
        const keeperIdx = keepers.indexOf(keeper)
        const splicedKeeper = keepers.splice(keeperIdx, 1)[0]
        
        splicedKeeper.done = true

        keepers.push(splicedKeeper)

        fs.writeFile('./data/keeper.json', JSON.stringify(keepers), (err) => {
            if (err) throw err

            res.render('home', { keepers: keepers })
        })
    })
})




function id () {
    return '_' + Math.random().toString(36).substr(2, 9);
}