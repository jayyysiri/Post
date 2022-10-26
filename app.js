"use strict";

const express = require("express");
const fs = require("fs/promises");
const globby = require("globby");
const multer = require("multer");
const cors = require("cors");
const res = require("express/lib/response");
const { json } = require("express/lib/response");

const app = express();

app.use(cors());
app.use(express.text());
app.use(express.static("public"));
app.use(express.json());
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));

const SERVER_ERROR =
  "Something went wrong on the server, please try again later.";

const CLIENT_ERR_CODE = 400;
const SERVER_ERR_CODE = 500;

// All available continents, a constant.
const continents = [
  "Africa",
  "Asia",
  "North America",
  "South America",
  "Europe",
];

/**
 * Returns an array of all promotions as json response.
 */
app.get("/promos", async (req, res, next) => {
  try {
    let fileContents = await fs.readFile("data/promos.txt", "utf8");
    res.json(fileContents.split("\n"));
  } catch (err) {
    res.status(500);
    err.message = SERVER_ERROR;
    return next(err);
  }
});

/**
 * Returns an array of all FAQs as json response.
 */
app.get("/faqs", async (req, res, next) => {
  try {
    let fileContents = await fs.readFile("data/faq.txt", "utf8");
    res.json(fileContents.split("\n"));
  } catch (err) {
    res.status(500);
    err.message = SERVER_ERROR;
    return next(err);
  }
});

/**
 * Returns an array of all postcards as json response.
 */
app.get("/postcards", async (req, res, next) => {
  try {
    let fileContents = await fs.readdir("public/postcards/", "utf8");
    res.json(fileContents);
  } catch (err) {
    res.status(500);
    err.message = SERVER_ERROR;
    return next(err);
  }
});

/**
 * Creates a GET endpoint to return all locations for each continent as a json response (array).
 */
for (let i = 0; i < continents.length; i++) {
  app.get(
    "/postcards" + formatContinent(continents[i]),
    async (req, res, next) => {
      try {
        let temp = [];
        let contData = await fs.readdir("data/continents/", "utf8");
        for (let j = 0; j < contData.length; j++) {
          let cityCont = await fs.readFile("data/continents/" + contData[j]);
          if (cityCont == continents[i]) {
            temp.push(contData[j].slice(0, -4) + ".png");
          }
        }
        res.json(temp);
      } catch (err) {
        res.status(500);
        err.message = SERVER_ERROR;
        return next(err);
      }
    }
  );
}

/**
 * Returns an array containing the description of location as a json response.
 */
app.get("/descriptions/:location", async (req, res, next) => {
  try {
    let locationName = req.params.location.toLowerCase();
    let txt = await fs.readFile(
      "data/descriptions/" + locationName + ".txt",
      "utf8"
    );
    res.json(txt);
  } catch (err) {
    res.status(500);
    err.message = SERVER_ERROR;
    return next(err);
  }
});

/**
 * POST endpoint to messages.json, takes in email and message as a json response.
 */
app.post("/contact", async (req, res, next) => {
  let msgReq = null;
  let email = req.body.email;
  let msg = req.body.msg;

  if (email && msg) {
    msgReq = {
      email: email,
      msg: msg,
    };
  }
  if (!msgReq) {
    res.status(CLIENT_ERR_CODE);
    next(Error("please enter a valid email and message."));
  }

  try {
    let allMessages = JSON.parse(
      await fs.readFile("data/messages.json", "utf8")
    );
    allMessages.push(msgReq);
    await fs.writeFile(
      "data/messages.json",
      JSON.stringify(allMessages, null, 2),
      "utf8"
    );
    res.type("text");
    res.send(
      "Thank you for your message! We will take a look at get back to you as soon as possible."
    );
  } catch (err) {
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
    next(err);
  }
});

// ----- HELPER FUNCTIONS -----
/**
 * Format continent for postcards/:continent URL.
 */
function formatContinent(txt) {
  txt = txt.toLowerCase();
  for (let i = 0; i < txt.length; i++) {
    if (txt[i] === " ") {
      txt = txt.slice(0, i) + "_" + txt.slice(i + 1);
    }
  }
  return "/" + txt;
}

/**
 * Standard error handling function.
 */
function errorHandler(err, req, res, next) {
  res.type("text");
  res.send(err.message);
}

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}...`);
});
