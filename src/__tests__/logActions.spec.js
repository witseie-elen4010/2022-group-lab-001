const request = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const router = require('../routes/actionRoutes')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const db = require("./testDatabase");
const Action = require('../models/actions')

app.use('/', router)

// This is a setup to allow for in-memory testing of the database 
beforeAll(async () => {
    await db.setUp();
});

afterEach(async () => {
    await db.dropCollections();
});

afterAll(async () => {
    await db.dropDatabase();
});

describe('When adding an action to the database', () => {
    let currentDate = new Date()
    currentDate = currentDate.toUTCString()
    it('it gets saved to the database', async () => {
        const body = { guess: 'hello', typeOfAction: 'guess', initiatedBy: 'Ryan', timeStamp: currentDate }
        const action = new Action(body)
        const savedAction = await action.save()
        const actions = await Action.findById(savedAction._id)
        expect(action.guess).toBe(body.guess)
        expect(action.typeOfAction).toBe(body.typeOfAction)
        expect(action.initiatedBy).toBe(body.initiatedBy)
    })
})

describe('When adding an action in the incorrect format to the database', () => {
    let currentDate = new Date()
    currentDate = currentDate.toUTCString()
    it('An error is thrown when the guess field is missing', async () => {
        const body = { typeOfAction: 'guess', initiatedBy: 'Ryan', timeStamp: currentDate }
        const action = new Action(body)
        let error = await action.validateSync();
        expect(error.errors['guess'].message).toBe('The guess field is missing')


    })

    it('An error is thrown when the initiatedBy field is missing', async () => {
        const body = { guess: 'hello', typeOfAction: 'guess', timeStamp: currentDate }
        const action = new Action(body)
        let error = await action.validateSync();
        expect(error.errors['initiatedBy'].message).toBe('The initiatedBy field is missing')
    })

    it('An error is thrown when the typeOfAction field is missing', async () => {
        const body = {
            guess: 'hello', initiatedBy: 'Benjy', timeStamp: currentDate
        }
        const action = new Action(body)
        let error = await action.validateSync();
        expect(error.errors['typeOfAction'].message).toBe('The typeOfAction field is missing')
    })
})