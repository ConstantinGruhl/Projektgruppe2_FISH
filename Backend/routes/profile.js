const express = require('express');
const db = require('../db');

const router = express.Router();

router.get("/listUsers", (request, response) => {
  db.query("SELECT * FROM Profile", (error, results) => {
    if (error) {
      return response.json({ error: error.message });
    }
    response.json(results);
  });
});

router.get("/:id", (request, response) => {
  const idProfile = request.params.id;
  const query = "SELECT * FROM Profile WHERE ?";
  db.query(query, idProfile, (error, result) => {
    if (error) {
      return response.json({ error: error.message });
    }
    response.json(result);
  });
});

router.post("/createUser", (request, response) => {
  const newProfile = request.body;
  const query = "INSERT INTO Profile SET ?";
  db.query(query, newProfile, (error, result) => {
    if (error) {
      return response.json({ error: error.message });
    }
    response.json({ message: 'New profile created.', insertId: result.insertId });
  });
});

router.delete("/deleteUser", (request, response) => {
  const deleteProfile = request.body;
  const query = "DELETE FROM Profile WHERE ?";
  console.log(query);
  db.query(query, deleteProfile, (error, result) => {
    if (error) {
      return response.json({ error: error.message });
    }
    response.json({ message: 'Profile deleted with ID', insertId: result.insertId });
  });
});

module.exports = router;
