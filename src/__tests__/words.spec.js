const request = require("supertest");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const router = require("../routes/wordRoutes");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", router);

const dictionary = require("../models/dictionary");
const validWords = dictionary.getDictionary();

describe("When making a request to /word", () => {
  it("should return a valid word", async () => {
    const response = await request(app).get("/");
    word = response.body;
    expect(response.statusCode).toBe(200);
    expect(validWords.includes(word)).toBe(true);
  });
});
