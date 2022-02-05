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
  try {
    const dbConnect = dbo.getDb();
    let shoe = req.body
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
     } catch (error) {
    console.log(error)
  }

});

router.delete("/", async (req, res) => {
  try {
    const dbConnect = dbo.getDb();

    const id = Number(req.query.id)
    const email = req.query.email

    let doc = await dbConnect
      .collection("wishlist")
      .updateOne({ email }, { $pull: { wishlist: { id } } });
    res.json(doc);
  } catch (error) {
    console.log(error.response);
  }
});

module.exports = router;
