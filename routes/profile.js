const express = require("express");
const router = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

/* GET */
router.get("/", async (req, res) => {
  try {
    const dbConnect = dbo.getDb();
    const email = req.query.email;

    const doc = await dbConnect.collection("users").findOne({ email });

    if (doc === null) {
      res.json({ exist: false });
    } else {
      res.json(doc);
    }
  } catch (error) {
    console.log(error.response);
  }
});

/* POST */
router.post("/", async (req, res) => {

  const dbConnect = dbo.getDb();
 
  let data = req.body

  let doc = await dbConnect.collection('users').insertOne(data)
  res.json(doc)

  /* try {
    const dbConnect = dbo.getDb();

    const matchDocument = {
      data: req.body,
      last_modified: new Date(),
    };

    dbConnect
      .collection("users")
      .insertOne(matchDocument, function (err, result) {
        if (err) {
          res.status(400).send("Error inserting matches!");
        } else {
          console.log(`Added a new match with email ${result}`);
          res.status(204).send();
        }
      });
  } catch (error) {
    console.log(error.response);
  } */
});

module.exports = router;
