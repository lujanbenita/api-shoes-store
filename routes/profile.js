const express = require("express")
const router = express.Router()

// This will help us connect to the database
const dbo = require("../db/conn");

/* GET */
router.get("/", async (req, res) => {
  try {
    const dbConnect = dbo.getDb();
    const email = req.query.email

    dbConnect
    .collection("users")
      .findOne({ email })
    
  } catch (error) {
    console.log(error.response)
  }
})

module.exports = router;