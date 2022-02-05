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

});

module.exports = router;
