const express = require("express");
const router = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

/* GET */
router.get("/", async (req, res) => {
  try {
    const dbConnect = dbo.getDb();
    const email = req.query.email;

    dbConnect
      .collection("orders")
      .find({ email })
      .limit(50)
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching orders!");
        }
        res.json(result);
      });
  } catch (error) {
    console.log(error.response);
  }
});

/* POST */
router.post("/", async (req, res) => {

    const dbConnect = dbo.getDb();
    let order = req.body

    let email = order.email
    delete order.email

    let doc = await dbConnect.collection('orders').insertOne({email, order})
    res.json(doc)
 
});

module.exports = router;
