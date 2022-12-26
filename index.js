const express = require('express')
// const http = require('http')
const chalk = require('chalk')
// const fs = require('fs/promises')
const path = require('path')
const { addNote, getNotes, removeNoteById, updateNote } = require('./notes.controller')
// npm i ejs -> установить ejs

const port = 3000
// const basePath = path.join(__dirname, 'pages')

const app = express()
app.set('view engine', 'ejs')
// поменять папку по умолчанию
app.set('views', 'pages')

app.use(express.static(path.resolve(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.get('/', async (req, res) => {
    // без ejs:
    // res.sendFile(path.join(basePath, 'index.ejs'))
    res.render('index', {
        // title уходит на frontend
        title: 'Express App',
        notes: await getNotes(),
        created: false
    })
})

app.post('/', async (req, res) => {
    // console.log(req.body)
    // без ejs:
    // await addNote(req.body.title)
    // res.sendFile(path.join(basePath, 'index.ejs'))
    await addNote(req.body.title)
    res.render('index', {
        // title уходит на frontend
        title: 'Express App',
        notes: await getNotes(),
        created: true
    })
})

app.delete('/:id', async (req, res) => {
    await removeNoteById(req.params.id)
    res.render('index', {
        // title уходит на frontend
        title: 'Express App',
        notes: await getNotes(),
        created: false
    })
})

app.put('/:id', async (req, res) => {
    await updateNote({ id: req.params.id, title: req.body.title })
    res.render('index', {
        title: 'Express App',
        notes: await getNotes(),
        created: false
    })
})

app.listen(port, ()=> {
    console.log(chalk.green(`Server has been started on port ${port}...`))
})

// _____server without express:
// const server = http.createServer(async (req, res)=>{
//     // console.log(req.method)
//     // console.log(req.url)
//     // res.end('Hello from server!')
//     if (req.method === 'GET') {
//         const content = await fs.readFile(path.join(basePath, 'index.ejs'))
//         res.setHeader('Content-type', 'text/html')
//         res.writeHead(200)
//         res.end(content)
//     } else if (req.method === 'POST') {
//         const body = []
//
//         res.writeHead(200, {
//             'Content-type': 'text/plain; charset=utf-8'
//         })
//
//         req.on('data', data => {
//             body.push(Buffer.from(data))
//         })
//         req.on('end', () => {
//             // console.log('End', body.toString().split('=')[1].replaceAll('+',' '))
//             const title = body.toString().split('=')[1].replaceAll('+',' ')
//             addNote(title)
//             res.end(`Note has been created. Title = ${title}`)
//         })
//     }
//
// })
//
// server.listen(port, ()=> {
//     console.log(chalk.green(`Server has been started on port ${port}...`))
// })