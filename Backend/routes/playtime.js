const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/create", async (req, res) =>
{
    const { idProfile, playTime_Start, playTime_End } = req.body;

    if (!idProfile || !playTime_Start || !playTime_End)
    {
        return res.status(400).json({
            message: "idProfile, playTime_Start, and playTime_End are required",
        });
    }

    try
    {
        // Extrahieren Sie das Datum aus playTime_Start
        const playDate = playTime_Start.split(" ")[0];

        // Überprüfung, ob bereits eine Playtime für diesen Benutzer an diesem Datum existiert
        db.query(
            "SELECT * FROM `playtime` WHERE `idProfile_PlayTime` = ? AND DATE(`PlayTime_Start`) = ?",
            [idProfile, playDate],
            (error, results) =>
            {
                if (error)
                {
                    console.error(error);
                    return res.status(500).json({ message: error.message });
                }

                if (results.length > 0)
                {
                    return res.status(400).json({
                        message: "A playtime already exists for this user on this date",
                    });
                }

                // Wenn keine Playtime existiert, fügen wir die neue Playtime ein
                db.query(
                    "INSERT INTO `playtime` SET ?",
                    {
                        idProfile_PlayTime: idProfile,
                        PlayTime_Start: playTime_Start,
                        PlayTime_End: playTime_End,
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
                                .json({ message: "Failed to insert playtime." });
                        }

                        res.status(201).json({ message: "Playtime inserted successfully" });
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



router.get("/getPlaytime/:id", async (req, res) =>
{
    const idProfile = req.params.id;

    if (!idProfile)
    {
        return res.status(400).json({
            message: "idProfile is required",
        });
    }

    try
    {
        db.query(
            "SELECT `PlayTime_Start`, `PlayTime_End` FROM `playtime` WHERE `idProfile_PlayTime` = ? AND DATE(`PlayTime_Start`) = CURDATE()",
            [idProfile],
            (error, result) =>
            {
                if (error)
                {
                    console.error(error);
                    return res.status(500).json({ message: error.message });
                }

                if (result.length === 0)
                {
                    return res
                        .status(404)
                        .json({ message: "No playtimes found for this profile." });
                }

                res.status(200).json({ playtimes: result });
            }
        );
    } catch (error)
    {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;
