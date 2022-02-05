const express = require("express");
const router = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

/* GET */
router.get("/", async (req, res) => {
  try {
    const dbConnect = dbo.getDb();
    const email = req.query.email;

    let resDoc = await dbConnect.collection("wishlist").findOne({ email });

    if (resDoc !== null) {
      res.json(resDoc);
    } else {
      res.json({
        email,
        wishlist: [],
      });
    }
  } catch (error) {
    console.log(error.response);
  }
});

/* POST */
router.post("/", async (req, res) => {
    const dbConnect = dbo.getDb();

    console.log('req.body', req.body);
    console.log('req.params', req.params);
    console.log('req.query', req.query);
    let shoe = req.body
    // shoe = JSON.parse(shoe)
    let email = shoe.email
    delete shoe.email
    
    if (shoe.price === undefined) {
      let doc = await dbConnect.collection('wishlist').updateOne({ email }, {$pull: {wishlist: {id: shoe.id}}})
      res.json(doc)
    } else {
      let doc = await dbConnect.collection('wishlist').updateOne({ email }, {$push: {wishlist: shoe}})
      if (doc.result.nModified === 0) {
        let insert = await dbConnect.collection('wishlist').insertOne({ email, wishlist: [shoe] })
        res.json(insert)
      } else {
        res.json(doc)
      }
    }


  /* try {
    const dbConnect = dbo.getDb();

    const matchDocument = {
      email: req.body.email,
      // last_modified: new Date(),
    };

    if (req.body.price === undefined) {
      dbConnect
        .collection("wishlist")
        .update(matchDocument, function (err, result) {
          if (err) {
            res.status(400).send("Error inserting matches!");
          } else {
            console.log(`Added a new match with email ${result}`);
            res.status(204).send();
          }
        });
    }
    dbConnect
      .collection("wishlist")
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

router.delete("/", async (req, res) => {
  try {
    const dbConnect = dbo.getDb();

    let data = JSON.parse(req.body);
    const { id, email } = data;

    let doc = await dbConnect
      .collection("wishlist")
      .update({ email }, { $pull: { wishlist: { id } } });
    res.json(doc);
  } catch (error) {
    console.log(error.response);
  }
});

module.exports = router;
