const request = require('supertest')
const actionController = require('../controllers/actionControllers')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const router = require('../routes/actionRoutes')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const db = require("./testDatabase");
const Action = require('../models/actions')
const { expect } = require('expect')
const exp = require('constants')
const { readyException } = require('jquery')
const { hasUncaughtExceptionCaptureCallback } = require('process')

// const Action = require()
app.use('/', router)

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
    it('it gets saved to the database', async () => {
        const body = { guess: 'hello', typeOfAction: 'guess', initiatedBy: 'Ryan' }
        const action = new Action(body)
        const savedAction = await action.save()
        const actions = await Action.findById(savedAction._id)
        expect(action.guess).toBe(body.guess)
        expect(action.typeOfAction).toBe(body.typeOfAction)
        expect(action.initiatedBy).toBe(body.initiatedBy)
        // res.send('ok')
        // const response = await (app).get('/allActions')
        // const response = await request(app).get('/allActions')
        // expect(response.statusCode).toBe(200)

    })
})