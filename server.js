// Loads the configuration from config.env to process.env
require("dotenv").config({ path: "./config.env" });

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// get MongoDB driver connection
const dbo = require("./db/conn");

const PORT = process.env.PORT || 5000;
const app = express();

// Capturar body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());


// routes
app.get('/', (req, res) => res.send('Server on!!!'));
app.use("/bestsellers", require("./routes/bestSellers"));
app.use("/cartlist", require("./routes/cartList"));
app.use("/orders", require("./routes/orders"));
app.use("/profile", require("./routes/profile"));
app.use("/wishlist", require("./routes/wishlist"));

// Global error handling
app.use(function (err, _req, res, next) {
  console.log('res Global error handling', /*res*/);
   console.error(err.stack);
  res.status(500).send('Something broke!');
});

// perform a database connection when the server starts
dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  // start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});
