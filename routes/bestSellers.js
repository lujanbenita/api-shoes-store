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
  try {
    const dbConnect = dbo.getDb();
    const listingQuery = { id: req.body.order.id };
    const updates = {
      $inc: {
        quantity: req.body.order.quantity
      }
    };

    dbConnect
    .collection("bestSellers")
    .updateOne(listingQuery, updates, function (err, _result) {
      if (err) {
        res.status(400).send(`Error updating likes on listing with id ${listingQuery.id}!`);
      } else {
        console.log("1 document updated");
      }
    });

  } catch (error) {
    console.log(error.response)
  }
})

module.exports = router;