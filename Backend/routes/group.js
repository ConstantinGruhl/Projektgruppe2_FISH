const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/listGroups", (request, response) =>
{
    db.query("SELECT * FROM `Group`", (error, results) =>
    {
        if (error)
        {
            return response.json({ error: error.message });
        }
        response.json(results);
    });
});

router.get("/groupsForUser/:userId", (req, res) =>
{
    const userId = req.params.userId;

    const query = `
    SELECT \`Group\`.*
    FROM \`Group\`
    JOIN profile_group ON \`Group\`.idGroup = profile_group.idGroup
    WHERE profile_group.idProfile = ?
    ORDER BY \`Group\`.idGroup;
  `;

    db.query(query, [userId], (error, results) =>
    {
        if (error)
        {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (results.length === 0)
        {
            return res.status(404).json({ message: "No groups found for this user" });
        }

        res.json(results);
    });
});

router.get("/usersWithPlayTime/:groupId", (req, res) =>
{
    const groupId = req.params.groupId;

    const query = `
      SELECT p.idProfile, p.Name, pt.PlayTime_Start, pt.PlayTime_End
      FROM profile_group pg
      JOIN profile p ON pg.idProfile = p.idProfile
      JOIN playtime pt ON p.idProfile = pt.idProfile_PlayTime
      WHERE pg.idGroup = ? AND DATE(pt.PlayTime_Start) = CURDATE()
      ORDER BY p.Name;
  `;

    db.query(query, [groupId], (error, results) =>
    {
        if (error)
        {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (results.length === 0)
        {
            return res.status(404).json({ message: "No users found in this group" });
        }

        res.json(results);
    });
});

router.get("/usersInGroup/:groupId", (req, res) =>
{
    const groupId = req.params.groupId;

    const query = `
    SELECT p.*
    FROM profile_group pg
    JOIN profile p ON pg.idProfile = p.idProfile
    WHERE pg.idGroup = ?
    ORDER BY p.Name;
    `;

    db.query(query, [groupId], (error, results) =>
    {
        if (error)
        {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (results.length === 0)
        {
            return res.status(404).json({ message: "No users found in this group" });
        }

        res.json(results);
    });
});


router.post("/createGroup", (request, response) =>
{
    const newGroup = request.body;
    const query = "INSERT INTO `Group` SET ?";

    db.query(query, newGroup, (error, result) =>
    {
        if (error)
        {
            return response.json({ error: error.message });
        }
        response.json({ message: "New group created.", idGroup: result.insertId });
    });
});

router.delete("/deleteGroup/:id", (request, response) =>
{
    const deleteGroup = request.params.id;
    const query = "DELETE FROM `Group` WHERE idGroup = ?";

    db.query(query, deleteGroup, (error, result) =>
    {
        if (error)
        {
            return response.json({ error: error.message });
        }
        response.json({ message: "Group deleted.", deleteGroup: result.insertId });
    });
});

router.put("/updateGroup/:id", (request, response) =>
{
    const id = request.params.id;
    const newDescription = request.body.description;

    const query = "UPDATE `Group` SET description = ? WHERE idGroup = ?";

    db.query(query, [newDescription, id], (error, result) =>
    {
        if (error)
        {
            return response.json({ error: error.message });
        }
        response.json({
            message: `Group with ID ${id} updated.`,
            affectedRows: result.affectedRows,
        });
    });
});

router.post("/addProfilesToGroup", (req, res) =>
{
    const profilesToAdd = req.body; // Array von { idProfile, idGroup } Objekten

    // Überprüfen, ob Daten vorhanden sind
    if (!profilesToAdd || !Array.isArray(profilesToAdd))
    {
        return res.status(400).json({
            message: "Array of profiles are required",
        });
    }

    // Beginne eine Transaktion, um alle Operationen als Einheit auszuführen
    db.beginTransaction((err) =>
    {
        if (err)
        {
            return res.status(500).json({ error: err.message });
        }

        let errorMessages = [];

        profilesToAdd.forEach((profileToAdd, index) =>
        {
            const { idProfile, idGroup } = profileToAdd;

            // Überprüfen ob die idProfile in der Tabelle profile existiert
            db.query(
                "SELECT * FROM `profile` WHERE `idProfile` = ?",
                [idProfile],
                (error, profiles) =>
                {
                    if (error)
                    {
                        errorMessages.push(error.message);
                    } else if (profiles.length === 0)
                    {
                        errorMessages.push(
                            `idProfile ${idProfile} does not exist in profile table`
                        );
                    } else
                    {
                        // Überprüfen, ob das Paar idProfile und idGroup bereits in der profile_group Tabelle existiert
                        db.query(
                            "SELECT * FROM `profile_group` WHERE `idProfile` = ? AND `idGroup` = ?",
                            [idProfile, idGroup],
                            (error, existingPairs) =>
                            {
                                if (error)
                                {
                                    errorMessages.push(error.message);
                                } else if (existingPairs.length > 0)
                                {
                                    errorMessages.push(
                                        `Pair of idProfile ${idProfile} and idGroup ${idGroup} already exists in profile_group table`
                                    );
                                } else
                                {
                                    // Wenn idProfile existiert und noch nicht in der Gruppe ist, fügen wir es zur profile_group Tabelle hinzu
                                    db.query(
                                        "INSERT INTO `profile_group` SET ?",
                                        {
                                            idProfile: idProfile,
                                            idGroup: idGroup,
                                        },
                                        (error) =>
                                        {
                                            if (error)
                                            {
                                                errorMessages.push(error.message);
                                            }
                                        }
                                    );
                                }

                                // Wenn wir das Ende der profileToAdd erreicht haben
                                if (index === profilesToAdd.length - 1)
                                {
                                    // Wenn es Fehler gab, machen wir die Transaktion rückgängig
                                    if (errorMessages.length > 0)
                                    {
                                        db.rollback(() =>
                                        {
                                            res.status(400).json({ errors: errorMessages });
                                        });
                                    } else
                                    {
                                        // Wenn alle Abfragen erfolgreich sind, committen wir die Transaktion
                                        db.commit((err) =>
                                        {
                                            if (err)
                                            {
                                                return db.rollback(() =>
                                                {
                                                    res.status(500).json({ message: err.message });
                                                });
                                            }

                                            res.status(201).json({
                                                message: "Profiles added to group successfully",
                                            });
                                        });
                                    }
                                }
                            }
                        );
                    }
                }
            );
        });
    });
});

router.delete("/deleteUser/:userId/:groupId", (req, res) =>
{
    const { userId, groupId } = req.params;

    const query = `
      DELETE FROM profile_group
      WHERE idProfile = ? AND idGroup = ?
  `;

    db.query(query, [userId, groupId], (error, result) =>
    {
        if (error)
        {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.affectedRows === 0)
        {
            return res.status(404).json({ message: "User not found in this group" });
        }

        res.json({ message: "User removed from the group successfully" });
    });
});

module.exports = router;
