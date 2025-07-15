const express = require("express");
const { v4: uuidv4 } = require("uuid");
const logger = require("../logging-middleware/middleware/logger");
const { createUser } = require("./controller/controller");

const app = express();
app.use(express.json());
app.use(logger);

const urlStore = {};

app.get("/", (req, res) => {
  res.send("URL Shortener Service running...");
});

app.post("/createUser", createUser);  

app.post("/shorturls", (req, res) => {
  const { url, validity, shortcode } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required." });

  const validMinutes = validity ? parseInt(validity) : 30;
  let finalCode = shortcode;

  if (shortcode) {
    if (urlStore[shortcode]) {
      return res.status(409).json({ error: "Shortcode already in use." });
    }
  } else {
    finalCode = uuidv4().slice(0, 6);
  }

  const expiryDate = new Date(Date.now() + validMinutes * 60000);

  urlStore[finalCode] = {
    originalUrl: url,
    createdAt: new Date(),
    expiry: expiryDate,
    clicks: []
  };

  res.status(201).json({
    shortLink: `http://localhost:3000/${finalCode}`,
    expiry: expiryDate.toISOString()
  });
});

app.get("/:shortcode", (req, res) => {
  const code = req.params.shortcode;

  if (!urlStore[code]) {
    return res.status(404).json({ error: "Shortcode not found." });
  }

  const { originalUrl, expiry } = urlStore[code];
  if (new Date() > expiry) {
    return res.status(410).json({ error: "Shortcode expired." });
  }

  res.redirect(originalUrl);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
