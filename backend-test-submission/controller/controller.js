const logEvent = require("../../logging-middleware/middleware/logger");
const { v4: uuidv4 } = require("uuid");

async function createUser(req, res) {
  await logEvent("backend", "info", "controller", "CreateUser API called");

  try {
    if (!req.body.name) {
      await logEvent("backend", "error", "controller", "Name missing in request");
      return res.status(400).send("Name is required");
    }

    await logEvent("backend", "info", "controller", "User creation in progress");

    res.status(201).send("User created successfully");

    await logEvent("backend", "info", "controller", "User created successfully");
  } catch (error) {
    await logEvent("backend", "fatal", "controller", `Unexpected error: ${error.message}`);
    res.status(500).send("Something went wrong");
  }
}

module.exports = { createUser };
