const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/notifyFriendRequest", async (req, res) =>
{
    const { idProfile_Receiver } = req.body;

    if (!idProfile_Receiver)
    {
        return res.status(400).json({
            message: "Receiver ID is required",
        });
    }

    try
    {
        db.query(
            "SELECT profile.Name, friends.RequestStatus FROM friends INNER JOIN profile ON friends.idProfile_Sender = profile.idProfile WHERE friends.idProfile_Receiver = ? AND friends.RequestStatus = 'sent'",
            [idProfile_Receiver],
            (error, rows) =>
            {
                if (error)
                {
                    console.error(error);
                    return res.status(500).json({ message: error.message });
                }

                if (rows.length === 0)
                {
                    return res.status(404).json({ message: "No friend requests found for this user" });
                }

                // Send notification for each request
                rows.forEach(row =>
                {
                    // Assuming a sendNotification function exists
                    sendNotification(idProfile_Receiver, `You have a new friend request from ${row.Name}`);
                });

                res.status(200).json({ message: "Friend request notifications sent successfully" });
            }
        );
    } catch (error)
    {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/openRequests/:idProfile", (req, res) =>
{
    const idProfile = req.params.idProfile;

    if (!idProfile)
    {
        return res.status(400).json({
            message: "Profile ID is required",
        });
    }

    const query = `
      SELECT 
        appointmentrequests.*, 
        profile.Name as senderName
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
        profile_appointmentrequest.idProfile_AppointmentRequest = ? AND 
        profile_appointmentrequest.Status = 'sent'
    `;

    db.query(query, [idProfile], (error, result) =>
    {
        if (error)
        {
            console.error(error);
            return res.status(500).json({
                message: "Internal server error",
            });
        }

        if (result.length === 0)
        {
            return res.status(404).json({
                message: "No open appointment requests found for this profile.",
            });
        }

        res.status(200).json({
            message: "Open appointment requests retrieved successfully",
            data: result,
        });
    });
});

router.get("/acceptedRequests/:idProfile", (req, res) =>
{
    const idProfile = req.params.idProfile;

    if (!idProfile)
    {
        return res.status(400).json({
            message: "Profile ID is required",
        });
    }

    const query = `
      SELECT 
        appointmentrequests.*, 
        profile.Name as senderName
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
        profile_appointmentrequest.idProfile_AppointmentRequest = ? AND 
        profile_appointmentrequest.Status = 'accepted'
    `;

    db.query(query, [idProfile], (error, result) =>
    {
        if (error)
        {
            console.error(error);
            return res.status(500).json({
                message: "Internal server error",
            });
        }

        if (result.length === 0)
        {
            return res.status(404).json({
                message: "No accepted appointment requests found for this profile.",
            });
        }

        res.status(200).json({
            message: "Accepted appointment requests retrieved successfully",
            data: result,
        });
    });
});


module.exports = router;
