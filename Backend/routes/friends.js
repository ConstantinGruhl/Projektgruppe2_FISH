const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/addFriend", async (req, res) =>
{
    const { idProfile_Sender, idProfile_Receiver } = req.body;

    // Überprüfen, ob Sender und Empfänger IDs vorhanden sind
    if (!idProfile_Sender || !idProfile_Receiver)
    {
        return res.status(400).json({
            message: "Sender and receiver IDs are required",
        });
    }

    try
    {
        // Überprüfen, ob der Sender bereits eine Anfrage an den Empfänger gesendet hat
        db.query(
            "SELECT * FROM `friends` WHERE `idProfile_Sender` = ? AND `idProfile_Receiver` = ?",
            [idProfile_Sender, idProfile_Receiver],
            async (error, rows) =>
            {
                if (error)
                {
                    return res.json({ error: error.message });
                }

                if (rows.length > 0)
                {
                    return res.json({ message: "Friend request has already been sent" });
                }

                // Hinzufügen der Freundschaftsanfrage in die Tabelle
                db.query(
                    "INSERT INTO `friends` SET ?",
                    {
                        idProfile_Sender: idProfile_Sender,
                        idProfile_Receiver: idProfile_Receiver,
                        RequestStatus: "sent",
                    },
                    (error, result) =>
                    {
                        if (error)
                        {
                            console.error(error);
                            return res.status(500).json({ message: error.message });
                        }

                        if (result.affectedRows === 0)
                        {
                            return res
                                .status(500)
                                .json({ message: "Failed to send friend request." });
                        }

                        res
                            .status(201)
                            .json({ message: "Friend request sent successfully" });
                    }
                );
            }
        );
    } catch (error)
    {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/acceptFriendRequest", async (req, res) =>
{
    const { idProfile_Sender, idProfile_Receiver } = req.body;

    if (!idProfile_Sender || !idProfile_Receiver)
    {
        return res.status(400).json({
            message: "Sender and receiver IDs are required",
        });
    }

    try
    {
        db.query(
            "UPDATE `friends` SET `RequestStatus` = 'accepted' WHERE `idProfile_Sender` = ? AND `idProfile_Receiver` = ?",
            [idProfile_Sender, idProfile_Receiver],
            (error, result) =>
            {
                if (error)
                {
                    console.error(error);
                    return res.status(500).json({ message: error.message });
                }

                if (result.affectedRows === 0)
                {
                    return res
                        .status(400)
                        .json({ message: "No such friend request exists" });
                }

                res
                    .status(200)
                    .json({ message: "Friend request accepted successfully" });
            }
        );
    } catch (error)
    {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/denyFriendRequest", async (req, res) =>
{
    const { idProfile_Sender, idProfile_Receiver } = req.body;

    if (!idProfile_Sender || !idProfile_Receiver)
    {
        return res.status(400).json({
            message: "Sender and receiver IDs are required",
        });
    }

    try
    {
        db.query(
            "DELETE FROM `friends` WHERE `idProfile_Sender` = ? AND `idProfile_Receiver` = ?",
            [idProfile_Sender, idProfile_Receiver],
            (error, result) =>
            {
                if (error)
                {
                    console.error(error);
                    return res.status(500).json({ message: error.message });
                }

                if (result.affectedRows === 0)
                {
                    return res
                        .status(400)
                        .json({ message: "No such friend request exists" });
                }

                res.status(200).json({ message: "Friend request denied successfully" });
            }
        );
    } catch (error)
    {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/friendList/:id", async (req, res) =>
{
    const idProfile = req.params.id;

    if (!idProfile)
    {
        return res.status(400).json({
            message: "Profile ID is required",
        });
    }

    try
    {
        db.query(
            "SELECT profile.Name, profile.idProfile \
        FROM `friends` \
        INNER JOIN `profile` ON \
        ((`friends`.`idProfile_Sender` = `profile`.`idProfile` AND `friends`.`idProfile_Receiver` = ?) OR \
        (`friends`.`idProfile_Receiver` = `profile`.`idProfile` AND `friends`.`idProfile_Sender` = ?)) \
        WHERE `friends`.`RequestStatus` = 'accepted'",
            [idProfile, idProfile],
            (error, rows) =>
            {
                if (error)
                {
                    console.error(error);
                    return res.status(500).json({ message: error.message });
                }

                if (rows.length === 0)
                {
                    return res
                        .status(404)
                        .json({ message: "No friends found for this user" });
                }

                res.status(200).json({ friends: rows });
            }
        );
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete("/deleteFriend", async (req, res) =>
{
    const { idProfile_Sender, idProfile_Receiver } = req.body;

    if (!idProfile_Sender || !idProfile_Receiver)
    {
        return res.status(400).json({
            message: "Both profile ID and friend ID are required",
        });
    }

    try
    {
        db.query(
            "DELETE FROM `friends` WHERE (`idProfile_Sender` = ? AND `idProfile_Receiver` = ?) OR (`idProfile_Sender` = ? AND `idProfile_Receiver` = ?) AND `RequestStatus` = 'accepted'",
            [
                idProfile_Sender,
                idProfile_Receiver,
                idProfile_Receiver,
                idProfile_Sender,
            ],
            (error, result) =>
            {
                if (error)
                {
                    console.error(error);
                    return res.status(500).json({ message: error.message });
                }

                if (result.affectedRows === 0)
                {
                    return res
                        .status(404)
                        .json({ message: "Users are not currently friends" });
                }

                res.status(200).json({ message: "Friend deleted successfully" });
            }
        );
    } catch (error)
    {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/requests/:id", async (req, res) =>
{
    const idProfile = req.params.id;

    if (!idProfile)
    {
        return res.status(400).json({
            message: "Profile ID is required",
        });
    }

    try
    {
        db.query(
            "SELECT `friends`.`idProfile_Sender`, `profile`.`Name` FROM `friends` INNER JOIN `profile` ON `friends`.`idProfile_Sender` = `profile`.`idProfile` WHERE `friends`.`idProfile_Receiver` = ? AND `friends`.`RequestStatus` = 'sent'",
            [idProfile],
            (error, rows) =>
            {
                if (error)
                {
                    console.error(error);
                    return res.status(500).json({ message: error.message });
                }

                if (rows.length === 0)
                {
                    return res
                        .status(404)
                        .json({ message: "No friend requests found for this user" });
                }

                res.status(200).json({ requests: rows });
            }
        );
    } catch (error)
    {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/friendsWithPlayTime/:id", async (req, res) =>
{
    const idProfile = req.params.id;

    if (!idProfile)
    {
        return res.status(400).json({
            message: "Profile ID is required",
        });
    }

    try
    {
        const query = `
        SELECT p.idProfile, p.Name, pt.PlayTime_Start, pt.PlayTime_End
        FROM friends f
        JOIN profile p ON (f.idProfile_Sender = p.idProfile OR f.idProfile_Receiver = p.idProfile)
        JOIN playtime pt ON p.idProfile = pt.idProfile_PlayTime
        WHERE f.RequestStatus = 'accepted' 
        AND (f.idProfile_Sender = ? OR f.idProfile_Receiver = ?)
        AND p.idProfile != ? 
        AND DATE(pt.PlayTime_Start) = CURDATE()
        ORDER BY p.Name;
    `;

        db.query(query, [idProfile, idProfile, idProfile], (error, results) =>
        {
            if (error)
            {
                console.error(error);
                return res.status(500).json({ message: "Internal server error" });
            }

            if (results.length === 0)
            {
                return res.status(404).json({ message: "No friends found for this user" });
            }

            res.json(results);
        });
    } catch (error)
    {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;
