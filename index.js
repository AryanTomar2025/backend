require('dotenv').config();
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Learning Backend");
});
app.listen(process.env.PORT, () => {
  console.log(`app listening of port ${port}`);
});
