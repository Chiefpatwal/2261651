const express = require("express");
const { v4: uuidv4 } = require("uuid");
const logEvent = require("../logging-middleware/middleware/logger");

const { createUser } = require("./controller/controller");

const app = express();
app.use(express.json());

// No logger middleware is defined — you probably meant logEvent per event, not app.use(logger)
// Remove: app.use(logger);

const urlStore = {};

app.get("/", (req, res) => {
  res.send("URL Shortener Service running...");
});

app.post("/createUser", createUser);

app.post("/shorturls", async (req, res) => {
  const { url, validity, shortcode } = req.body;

  if (!url) {
    await logEvent("backend", "error", "server", "URL missing in request body.");
    return res.status(400).json({ error: "URL is required." });
  }

  const validMinutes = validity ? parseInt(validity) : 30;
  let finalCode = shortcode;

  if (shortcode) {
    if (urlStore[shortcode]) {
      await logEvent("backend", "warn", "server", `Shortcode ${shortcode} already in use.`);
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

  await logEvent("backend", "info", "server", `ShortURL created with code ${finalCode}.`);

  res.status(201).json({
    shortLink: `http://localhost:3000/${finalCode}`,
    expiry: expiryDate.toISOString()
  });
});

app.get("/:shortcode", async (req, res) => {
  const code = req.params.shortcode;

  if (!urlStore[code]) {
    await logEvent("backend", "warn", "server", `Shortcode ${code} not found.`);
    return res.status(404).json({ error: "Shortcode not found." });
  }

  const { originalUrl, expiry } = urlStore[code];
  if (new Date() > expiry) {
    await logEvent("backend", "info", "server", `Shortcode ${code} expired.`);
    return res.status(410).json({ error: "Shortcode expired." });
  }

  await logEvent("backend", "info", "server", `Redirecting to ${originalUrl}.`);
  res.redirect(originalUrl);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
