const express = require("express");
const router = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

/* GET */
router.get("/", async (req, res) => {
  try {
    const dbConnect = dbo.getDb();
    const email = req.query.email;

    let resDoc = await dbConnect.collection("users").findOne({ email });

    if (resDoc === null) {
      res.json({ exist: false });
    } else {
      res.json(resDoc);
    }
  } catch (error) {
    console.log(error.response);
  }
});

/* POST */
router.post(async (req, res) => {
  try {
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
  }
});

module.exports = router;
