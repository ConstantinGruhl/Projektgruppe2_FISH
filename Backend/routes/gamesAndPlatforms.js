const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/addGame", (req, res) => {
  const { Name } = req.body;

  if (!Name) {
    return res.status(400).json({ message: "Game name is required" });
  }

  db.query("SELECT * FROM game WHERE Name = ?", [Name], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: "Game name already exists" });
    }

    const query = "INSERT INTO game (Name) VALUES (?)";

    db.query(query, [Name], (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(500).json({ message: "Failed to add game." });
      }

      res
        .status(201)
        .json({ message: "Game added successfully", id: result.insertId });
    });
  });
});

router.post("/addPlatform", (req, res) => {
  const { Name } = req.body;

  if (!Name) {
    return res.status(400).json({ message: "Platform name is required" });
  }

  db.query("SELECT * FROM platform WHERE Name = ?", [Name], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: "Platform name already exists" });
    }

    const query = "INSERT INTO platform (Name) VALUES (?)";

    db.query(query, [Name], (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(500).json({ message: "Failed to add platform." });
      }

      res
        .status(201)
        .json({ message: "Platform added successfully", id: result.insertId });
    });
  });
});

router.post("/add/:id", (req, res) => {
  const profileId = req.params.id;
  const { idGame, idPlatform } = req.body;

  if (!idGame || !idPlatform) {
    return res
      .status(400)
      .json({ message: "Game id and platform id are required" });
  }

  // Prüfen, ob das Spiel in der Datenbank vorhanden ist
  db.query("SELECT * FROM game WHERE idGame = ?", [idGame], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "Game id does not exist" });
    }

    // Prüfen, ob die Plattform in der Datenbank vorhanden ist
    db.query(
      "SELECT * FROM platform WHERE idPlatform = ?",
      [idPlatform],
      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Internal server error" });
        }

        if (result.length === 0) {
          return res
            .status(400)
            .json({ message: "Platform id does not exist" });
        }

        // Prüfen, ob die gleiche Kombination bereits in der Tabelle profile_gameandplatform vorhanden ist
        db.query(
          "SELECT * FROM profile_gameandplatform WHERE idProfile_GameAndPlatform = ? AND idGame = ? AND idPlatform = ?",
          [profileId, idGame, idPlatform],
          (error, result) => {
            if (error) {
              console.error(error);
              return res.status(500).json({ message: "Internal server error" });
            }

            if (result.length > 0) {
              return res
                .status(400)
                .json({ message: "Same combination already exists" });
            }

            // Fügen Sie die neue Kombination in die Tabelle ein
            db.query(
              "INSERT INTO profile_gameandplatform SET idProfile_GameAndPlatform = ?, idGame = ?, idPlatform = ?",
              [profileId, idGame, idPlatform],
              (error, result) => {
                if (error) {
                  console.error(error);
                  return res
                    .status(500)
                    .json({ message: "Internal server error" });
                }

                res.status(201).json({
                  message: "Game and platform added successfully",
                  id: result.insertId,
                });
              }
            );
          }
        );
      }
    );
  });
});

router.delete("/delete/:id", (req, res) => {
  const profileId = req.params.id;
  const { idGame, idPlatform } = req.body;

  if (!idGame || !idPlatform) {
    return res
      .status(400)
      .json({ message: "Game id and platform id are required" });
  }

  db.query(
    "DELETE FROM profile_gameandplatform WHERE idProfile_GameAndPlatform = ? AND idGame = ? AND idPlatform = ?",
    [profileId, idGame, idPlatform],
    (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(400).json({
          message: "No game and platform found with the provided ids",
        });
      }

      res
        .status(200)
        .json({ message: "Game and platform deleted successfully" });
    }
  );
});

router.get("/listAll/:id", (req, res) => {
  const profileId = req.params.id;

  // Überprüfung, ob die Profil-ID gültig ist
  if (!profileId) {
    return res.status(400).json({ message: "Profile id is required" });
  }

  const query = `
        SELECT profile.idProfile, profile.Name as ProfileName, game.idGame, game.Name as GameName, platform.idPlatform, platform.Name as PlatformName
        FROM profile_gameandplatform
        INNER JOIN game ON profile_gameandplatform.idGame = game.idGame
        INNER JOIN platform ON profile_gameandplatform.idPlatform = platform.idPlatform
        INNER JOIN profile ON profile_gameandplatform.idProfile_GameAndPlatform = profile.idProfile
        WHERE idProfile_GameAndPlatform = ?
    `;

  db.query(query, [profileId], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No games and platforms found." });
    }

    res.status(200).json(result);
  });
});

module.exports = router;
