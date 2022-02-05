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

   /*  dbConnect
    .collection("cart")
    .find({email}).limit(50)
    .toArray(function (err, result) {
      if (err) {
        console.log('err IF', err);
        res.status(400).send("Error fetching listings!");
      } 
      if (result !== []) {
        res.json(result);
      }
    });

    const insert = dbConnect.collection("cart").insertOne({ email, cartlist: [] })
    res.json(insert) */


});

/* POST */ 
router.post("/", async (req, res) => {
   console.log('req.body', req.body);
  try {
    const dbConnect = dbo.getDb();
    console.log("dentro")

    res.json(req.body)

   /*  let shoe = req.body
    shoe = JSON.parse(shoe)
    let email = shoe.email
    delete shoe.email

    if (shoe?.exist === true) {
      // si existe sobreescribe la cantidad a la nueva que se le pasa
      let doc = await dbConnect.collection('cart').update({ email, "cartlist.id": shoe.id }, {$set:{"cartlist.$.quantity":shoe.quantity}})
      res.json(doc)
      res.send({ status: 'SUCCESS' });
    } else {
      // no existe en el cartlist
      if (shoe.isNew) {
        let insert = await dbConnect.collection('cart').insertOne({ email, cartlist: [] })
      }
      let doc = await dbConnect.collection('cart').update({ email }, {$push: {cartlist: shoe}})
      res.json(doc)
      res.send({ status: 'SUCCESS' });
    } */
    
  } catch (error) {
    console.log(error)
  }

  /* try {
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
          res.status(200).json("ok")
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
          res.status(200).json("ok")
        }
      });

  } catch (error) {
    console.log(error.response)
  } */
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
  //try {
  const dbConnect = dbo.getDb();

  let shoeId = Number(req.query.id)
  let email = req.query.email

  let doc = await dbConnect.collection('cart').update({ email, "cartlist.id": shoeId }, { $pull: { cartlist: { id:shoeId }}})
  res.json(doc)
    

   /* 
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
        console.log("1 document deleted");
        res.status(200).send("ok")
      }
    });
     */

  // } catch (error) {
  //   console.log(error.response)
  // }

})

module.exports = router;