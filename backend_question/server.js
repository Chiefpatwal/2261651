const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("setting up backend server");
});

app.listen(3000, () => console.log("Server running on port 3000"));
