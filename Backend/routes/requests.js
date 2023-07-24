const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/add/:id", (req, res) =>
{
    const profileId = req.params.id;
    const {
        proposedStartTime,
        proposedEndTime,
        description,
        gameId,
    } = req.body;

    if (
        !proposedStartTime ||
        !proposedEndTime ||
        !description ||
        !gameId ||
        !profileId
    )
    {
        return res.status(400).json({
            message:
                "Proposed start time, proposed end time, description, game ID, and profileId (in url) are required",
        });
    }

    const query = `
      INSERT INTO appointmentrequests (ProposedStartTime, ProposedEndTime, Description, idGame_AppointmentRequest, idProfileSender_AppointmentRequest)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            proposedStartTime,
            proposedEndTime,
            description,
            gameId,
            profileId,
        ],
        (error, result) =>
        {
            if (error)
            {
                console.error(error);
                return res.status(500).json({ message: "Internal server error" });
            }

            if (result.affectedRows === 0)
            {
                return res
                    .status(500)
                    .json({ message: "Failed to add appointment request." });
            }

            // Das idAppointmentRequest des neu erstellten Terminantrags extrahieren
            const idAppointmentRequest = result.insertId;

            res.status(201).json({
                message: "Appointment request added successfully",
                idAppointmentRequest: idAppointmentRequest  // Die ID zurückgeben
            });
        }
    );
});

router.get("/profiles/:idAppointmentRequest", (req, res) => {
    const idAppointmentRequest = req.params.idAppointmentRequest;

    if (!idAppointmentRequest) {
        return res.status(400).json({ message: "Appointment request ID is required" });
    }

const query = `
SELECT profile_appointmentrequest.idProfile_AppointmentRequest, profile_appointmentrequest.Status, account.AccountName
FROM profile_appointmentrequest
JOIN account ON profile_appointmentrequest.idProfile_AppointmentRequest = account.idProfile
WHERE profile_appointmentrequest.idAppointmentRequest = ?`;

    db.query(query, [idAppointmentRequest], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "No profiles found for this appointment request." });
        }

        res.status(200).json({
            message: "Profiles for the appointment request retrieved successfully",
            data: result,
        });
    });
});


router.post("/addGroup", (req, res) =>
{
    // Extrahiere die IDs aus dem Anforderungskörper
    const { requestId, groupId } = req.body;

    if (!requestId || !groupId)
    {
        return res
            .status(400)
            .json({ message: "Request ID and group ID are required" });
    }

    // Wähle zuerst alle Profile aus der Gruppe aus
    const selectProfilesQuery =
        "SELECT idProfile FROM profile_group WHERE idGroup = ?";

    db.query(selectProfilesQuery, [groupId], (error, profiles) =>
    {
        if (error)
        {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }

        // Füge jedes Profil zur Terminanfrage hinzu
        profiles.forEach((profile) =>
        {
            const insertProfileQuery =
                "INSERT INTO profile_appointmentrequest (idAppointmentRequest, idProfile_AppointmentRequest, Status) VALUES (?, ?, 'sent')";

            db.query(
                insertProfileQuery,
                [requestId, profile.idProfile],
                (error, result) =>
                {
                    if (error)
                    {
                        console.error(error);
                        return res.status(500).json({ message: "Internal server error" });
                    }

                    if (result.affectedRows === 0)
                    {
                        return res.status(500).json({
                            message: "Failed to add profile to appointment request.",
                        });
                    }
                }
            );
        });

        res
            .status(201)
            .json({ message: "Profiles added to appointment request successfully" });
    });
});

router.post("/addProfiles", (req, res) =>
{
    // Extrahiere die Daten aus dem Anforderungskörper
    const { requestId, profileIds } = req.body;

    if (!requestId || !profileIds || profileIds.length === 0)
    {
        return res
            .status(400)
            .json({ message: "Request ID and at least one profile ID are required" });
    }

    // Füge jedes Profil zur Anfrage hinzu
    profileIds.forEach((profileId) =>
    {
        const insertProfileQuery =
            "INSERT INTO profile_appointmentrequest (idAppointmentRequest, idProfile_AppointmentRequest, Status) VALUES (?, ?, 'sent')";

        db.query(insertProfileQuery, [requestId, profileId], (error, result) =>
        {
            if (error)
            {
                console.error(error);
                return res.status(500).json({ message: "Internal server error" });
            }

            if (result.affectedRows === 0)
            {
                return res
                    .status(500)
                    .json({ message: "Failed to add profile to appointment request." });
            }
        });
    });

    res
        .status(201)
        .json({ message: "Profiles added to appointment request successfully" });
});

router.get("/listAll/:idProfile", (req, res) =>
{
    // Extrahiere die Profil-ID aus der URL
    const idProfile = req.params.idProfile;

    // Überprüfe, ob die Profil-ID angegeben ist
    if (!idProfile)
    {
        return res.status(400).json({ message: "Profile ID is required" });
    }

    const query = `
    SELECT
    appointmentrequests.*,
    profile_appointmentrequest.Status,
    profile.name AS senderName
  FROM
    profile_appointmentrequest
  INNER JOIN
    appointmentrequests
  ON
    profile_appointmentrequest.idAppointmentRequest = appointmentrequests.idAppointmentRequests
  INNER JOIN
    profile
  ON
    appointmentrequests.idProfileSender_AppointmentRequest = profile.idProfile
  WHERE
    profile_appointmentrequest.idProfile_AppointmentRequest = ? AND profile_appointmentrequest.Status = 'sent'
`;

    db.query(query, [idProfile], (error, result) =>
    {
        if (error)
        {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.length === 0)
        {
            return res
                .status(404)
                .json({ message: "No appointment requests found for this profile." });
        }

        res.status(200).json({
            message: "Appointment requests retrieved successfully",
            data: result,
        });
    });
});

router.put("/accept/:idProfile/:idAppointmentRequest", (req, res) =>
{
    const idProfile = req.params.idProfile;
    const idAppointmentRequest = req.params.idAppointmentRequest;

    if (!idProfile || !idAppointmentRequest)
    {
        return res.status(400).json({ message: "Profile ID and Appointment Request ID are required" });
    }

    const query = `
      UPDATE profile_appointmentrequest
      SET Status = 'accepted'
      WHERE idProfile_AppointmentRequest = ? AND idAppointmentRequest = ?
    `;

    db.query(query, [idProfile, idAppointmentRequest], (error, result) =>
    {
        if (error)
        {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.affectedRows === 0)
        {
            return res.status(404).json({ message: "No matching appointment request found." });
        }

        res.status(200).json({ message: "Appointment request accepted successfully" });
    });
});

router.get("/acceptedRequests/:idProfile", (req, res) =>
{
    // Extrahiere die Profil-ID aus der URL
    const idProfile = req.params.idProfile;

    // Überprüfe, ob die Profil-ID angegeben ist
    if (!idProfile)
    {
        return res.status(400).json({ message: "Profile ID is required" });
    }

    const query = `
    SELECT
        appointmentrequests.*,
        profile_appointmentrequest.Status,
        profile.name AS senderName
    FROM
        profile_appointmentrequest
    INNER JOIN
        appointmentrequests
    ON
        profile_appointmentrequest.idAppointmentRequest = appointmentrequests.idAppointmentRequests
    INNER JOIN
        profile
    ON
        appointmentrequests.idProfileSender_AppointmentRequest = profile.idProfile
    WHERE
        profile_appointmentrequest.idProfile_AppointmentRequest = ? 
        AND profile_appointmentrequest.Status = 'accepted'
        AND DATE(appointmentrequests.ProposedStartTime) = CURDATE()
    `;

    db.query(query, [idProfile], (error, result) =>
    {
        if (error)
        {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.length === 0)
        {
            return res
                .status(404)
                .json({ message: "No accepted appointment requests found for this profile." });
        }

        res.status(200).json({
            message: "Accepted appointment requests retrieved successfully",
            data: result,
        });
    });
});



router.put("/deny/:idProfile/:idAppointmentRequest", (req, res) =>
{
    const idProfile = req.params.idProfile;
    const idAppointmentRequest = req.params.idAppointmentRequest;

    if (!idProfile || !idAppointmentRequest)
    {
        return res.status(400).json({ message: "Profile ID and Appointment Request ID are required" });
    }

    const query = `
      UPDATE profile_appointmentrequest
      SET Status = 'denied'
      WHERE idProfile_AppointmentRequest = ? AND idAppointmentRequest = ?
    `;

    db.query(query, [idProfile, idAppointmentRequest], (error, result) =>
    {
        if (error)
        {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (result.affectedRows === 0)
        {
            return res.status(404).json({ message: "No matching appointment request found." });
        }

        res.status(200).json({ message: "Appointment request denied successfully" });
    });
});



module.exports = router;
