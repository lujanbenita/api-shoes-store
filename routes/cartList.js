const express = require("express");
const router = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

/* Get */
router.get("/", async (req, res) => {
  const dbConnect = dbo.getDb();
  
  const email = req.query.email
  let doc = await dbConnect.collection('cart').find({email}).toArray()

  if (doc === null) {
    let insert = await dbConnect.collection('cart').insertOne({ email, cartlist: [] })
    res.json(insert)
  } else {
    res.json(doc)
  }

});

/* POST */ 
router.post("/", async (req, res) => {
  try {
    const dbConnect = dbo.getDb();
    let shoe = req.body
    let email = shoe.email
    delete shoe.email

    if (shoe?.exist === true) {
      // si existe sobreescribe la cantidad a la nueva que se le pasa
      let doc = await dbConnect.collection('cart').updateOne({ email, "cartlist.id": shoe.id }, {$set:{"cartlist.$.quantity":shoe.quantity}})
      res.json(doc)
    } else {
      // no existe en el cartlist
      if (shoe.isNew) {
        let insert = await dbConnect.collection('cart').insertOne({ email, cartlist: [] })
      }
      let doc = await dbConnect.collection('cart').updateOne({ email }, {$push: {cartlist: shoe}})
      res.json(doc)
    }
    
  } catch (error) {
    console.log(error)
  }

})

/* PUT */ 
router.put("/", async (req, res) => {
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
        res.status(200).json("ok")
      }
    });

  } catch (error) {
    console.log(error.response)
  }
})

/* DELETE */ 
router.delete("/", async (req, res) => {
  const dbConnect = dbo.getDb();

  let shoeId = Number(req.query.id)
  let email = req.query.email

  let doc = await dbConnect.collection('cart').update({ email, "cartlist.id": shoeId }, { $pull: { cartlist: { id:shoeId }}})
  res.json(doc)

})

module.exports = router;