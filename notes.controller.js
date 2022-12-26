const fs = require('fs/promises')
const path = require('path')
const chalk = require('chalk')

const notesPath = path.join(__dirname, 'db.json')

async function addNote(title) {
    // const notes = require('./db.json')
    // const notes = Buffer.from(buffer).toString('utf-8')
    const notes = await getNotes()

    const note = {
        title,
        id: Date.now().toString()
    }
    notes.push(note)
    await fs.writeFile(notesPath, JSON.stringify(notes))
    console.log(chalk.green.inverse('Note was added'))
}

async function getNotes() {
    const notes = await fs.readFile(notesPath, {encoding: 'utf-8'})
    return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : []
    // return require('./db.json')
}

async function printNotes() {
    const notes = await getNotes()
    console.log(chalk.bgBlue('Here is the list of notes:'))
    notes.forEach(note=> {
        console.log(chalk.blue(note.id), chalk.blue(note.title))
    })
}

async function removeNoteById(id) {
    const notes = await getNotes()
    const newNotes = notes.filter((item) => {
        // console.log(id, typeof id)
        // console.log(item, typeof item)
        // console.log(item.id, typeof item.id)
        return item.id !== id.toString()
    })
    await fs.writeFile(notesPath, JSON.stringify(newNotes))
    console.log(chalk.red(`Note with id="${id}" has been removed.`))
}

async function updateNote(noteData) {
    const notes = await getNotes()
    const index = notes.findIndex(note => note.id === noteData.id)
    if (index >= 0) {
        notes[index] = { ...notes[index], ...noteData }
        await fs.writeFile(notesPath, JSON.stringify(notes))
        console.log(chalk.bgGreen(`Note with id="${noteData.id}" has been updated!`))
    }
}

module.exports = {
    addNote, printNotes, removeNoteById, getNotes, updateNote
}