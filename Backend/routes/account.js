const express = require("express");
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//const User = require('../models/User'); // Ihr User Model
const router = express.Router();
var validator = require("validator");

const SECRET =
    "d91e338ae626a39360c7beaac016b562da3a60202eef45a05c07419d0ba508c7";

// So das sollte eigentlich alles funktionieren. Mit dem richtigen Aufbau kann man jetzt einen Account erstellen und ein Profil mit der gleichen idProfile dazu. Das Passwort sollte encrypted gespeichert werden und ein JWT dazu erstellt. Joa und ein paar Plausichecks - weiß nicht wie komplett das ist aber für den Anfang sollte's reichen.

router.post("/register", async (req, res) =>
{
    const { firstname, lastname, accountname, profilename, password, email } = req.body;

    // Überprüfen, ob Benutzername, Passwort und E-Mail-Adresse vorhanden sind
    if (!firstname || !lastname || !accountname || !password || !email)
    {
        return res.status(400).json({
            message:
                "Firstname, lastname, accountname, password, and email are required",
        });
    }

    // Überprüfen der Länge des Benutzernamens
    if (firstname.length < 1 || firstname.length > 20)
    {
        return res
            .status(400)
            .json({ message: "Firstname must be between 1 and 20 characters" });
    }

    if (lastname.length < 1 || lastname.length > 20)
    {
        return res
            .status(400)
            .json({ message: "Lastname must be between 1 and 20 characters" });
    }

    if (accountname.length < 1 || accountname.length > 20)
    {
        return res
            .status(400)
            .json({ message: "Accountname must be between 1 and 20 characters" });
    }

    // Überprüfen des Formats des Benutzernamens
    if (!/^[a-zA-Z0-9]+$/.test(firstname))
    {
        return res
            .status(400)
            .json({ message: "Firstname can only contain alphanumeric characters" });
    }

    if (!/^[a-zA-Z0-9]+$/.test(lastname))
    {
        return res
            .status(400)
            .json({ message: "Lastname can only contain alphanumeric characters" });
    }

    // Überprüfen der Passwortlänge
    if (password.length < 8)
    {
        return res
            .status(400)
            .json({ message: "Password must be at least 8 characters" });
    }

    // Überprüfen der Passwortkomplexität
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/.test(password))
    {
        return res.status(400).json({
            message:
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        });
    }

    // Überprüfen der E-Mail-Adresse
    if (!validator.isEmail(email))
    {
        return res.status(400).json({
            message: "Please provide a valid email address",
        });
    }

    try
    {
        // Überprüfen ob der Benutzername bereits verwendet wird
        db.query(
            "SELECT * FROM `account` WHERE `AccountName` = ?",
            [accountname],
            async (error, rows) =>
            {
                if (error)
                {
                    return res.json({ error: error.message });
                }

                if (rows.length > 0)
                {
                    return res.json({ message: "Accountname is already in use" });
                }

                db.query(
                    "INSERT INTO `profile` SET ?",
                    {
                        Name: profilename,
                    },
                    async (error, profileResult) =>
                    {
                        if (error)
                        {
                            console.error(error);
                            return res.status(500).json({ message: error.message });
                        }

                        if (profileResult.affectedRows === 0)
                        {
                            return res
                                .status(500)
                                .json({ message: "Username already exists." });
                        }

                        // Hash the password
                        const hashedPassword = await bcrypt.hash(password, 10);

                        // Erstellen Sie einen neuen Benutzer
                        db.query(
                            "INSERT INTO `account` SET ?",
                            {
                                Name: firstname,
                                LastName: lastname,
                                AccountName: accountname,
                                Email: email,
                                Password: hashedPassword,
                                idProfile: profileResult.insertId,
                            },
                            (error, result) =>
                            {
                                if (error)
                                {
                                    console.error(error);
                                    return res.status(500).json({ message: error.message });
                                }
                                const profileID = profileResult.insertId;
                                if (result.affectedRows === 0)
                                {
                                    return res
                                        .status(500)
                                        .json({ message: "Failed to create user." });
                                }

                                // Erstelle einen JWT
                                const token = jwt.sign({ id: result.insertId }, SECRET, {
                                    expiresIn: "1h",
                                });

                                const user = {
                                    firstname,
                                    lastname,
                                    accountname,
                                    profilename,
                                    password,
                                    email,
                                    profileID
                                };

                                res
                                    .status(201)
                                    .json({
                                        message: "User created successfully", user: user
                                    });
                            }
                        );
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

router.post("/login", (req, res) =>
{
    const { accountname, password } = req.body;

    // Suche den Nutzer in der Datenbank
    db.query(
        "SELECT * FROM account WHERE AccountName = ?",
        [accountname],
        (error, rows) =>
        {
            if (error)
            {
                console.error(error);
                return res.status(500).json({ message: "Internal server error" });
            }

            if (rows.length === 0)
            {
                return res
                    .status(400)
                    .json({ message: "Invalid accountname or password" });
            }

            const user = rows[0];

            // Überprüfe das Passwort
            bcrypt.compare(password, user.Password, (err, isMatch) =>
            {
                if (err)
                {
                    console.error(err);
                    return res.status(500).json({ message: "Internal server error" });
                }

                if (!isMatch)
                {
                    return res
                        .status(400)
                        .json({ message: "Invalid accountname or password" });
                }

                // Erstelle einen JWT
                const token = jwt.sign({ id: user.ID }, SECRET, {
                    expiresIn: "1h",
                });

                res.json({ message: "Logged in successfully", user: user });
            });
        }
    );
});

module.exports = router;
