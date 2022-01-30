const express = require("express");
const router = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

/* Get */
router.get("/", async (req, res) => {
  try {
    const dbConnect = dbo.getDb();
    const email = req.query.email

    dbConnect
    .collection("cart")
    .find({email}).limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } 
      if (result !== []) {
        res.json(result);
      }
    });

    const insert = dbConnect.collection("cart").insertOne({ email, cartlist: [] })
    res.json(insert)

  } catch (error) {
    console.error(error.response);
  }
});

/* POST */ 
router.post(async (req, res) => {
  try {
    const dbConnect = dbo.getDb();
    const listingQuery = { email : req.body.email, "cartlist.id": req.body.id };
    const updates = {
      $set: {
        "cartlist.$.quantity": req.body.quantity
      }
    };

    if (req.body?.exist) {
      dbConnect
      .collection("cart")
      .updateOne(listingQuery, updates, function (err, _result) {
        if (err) {
          res.status(400).send(`Error updating likes on listing with email ${listingQuery.email}!`);
        } else {
          console.log("1 document updated");
        }
      });
      return
    }

    if (req.body.isNeew) {
      dbConnect
      .collection("cart")
      .insertOne({email: req.body.email, cartlist: []}, function (err, _result) {
        if (err) {
          res.status(400).send(`Error updating likes on listing with email ${req.body}!`);
        } else {
          console.log("1 document insert");
        }
      });
      return
    }

    dbConnect
      .collection("cart")
      .update({email: req.body.email}, {$push: {cartlist: req.body}}, function (err, _result) {
        if (err) {
          res.status(400).send(`Error updating likes on listing with email ${req.body}!`);
        } else {
          console.log("1 document insert");
        }
      });

  } catch (error) {
    console.log(error.response)
  }
})

/* PUT */ 
router.put(async (req, res) => {
  try {
    const dbConnect = dbo.getDb();

    const listingQuery = { email: req.body };
    const updates = {
      $set: {
        cartlist: []
      }
    };

    dbConnect
    .collection("cart")
    .update(listingQuery, updates, function (err, _result) {
      if (err) {
        res.status(400).send(`Error updating likes on listing with id ${listingQuery.email}!`);
      } else {
        console.log("1 document updated");
      }
    });

  } catch (error) {
    console.log(error.response)
  }
})
/* DELETE */ 
router.delete(async (req, res) => {
  try {
    const dbConnect = dbo.getDb();

    const listingQuery = { email: req.body.email, "cartlist.id": req.body.id };
    const updates = {
      $pull: {
        cartlist: {id: req.body.id}
      }
    };

    dbConnect
    .collection("cart")
    .update(listingQuery, updates, function (err, _result) {
      if (err) {
        res.status(400).send(`Error updating likes on listing with id ${listingQuery.email}!`);
      } else {
        console.log("1 document updated");
      }
    });

  } catch (error) {
    console.log(error.response)
  }
})

module.exports = router;