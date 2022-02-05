const express = require("express");
const router = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

/* Get */
router.get("/", async (req, res) => {
  try {
    const dbConnect = dbo.getDb();

    dbConnect
    .collection("bestSellers")
    .find({}).limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
     } else {
        res.json(result);
      }
    });

  } catch (error) {
    console.error(error.response);
  }
});

/* PUT */ 
router.post("/", async (req, res) => {
  const dbConnect = dbo.getDb();
    let order = req.body

    let doc = dbConnect.collection('bestSellers').updateOne({ id: order.id }, { $inc: { "quantity": order.quantity }})
    res.json(doc)

})

module.exports = router;